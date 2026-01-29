import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionsService } from '../permissions/permissions.service';
import { ShareRepository } from './share.repository';
import { ShareRole, ResourceType } from '@prisma/client';
import { InviteUserDto } from './dto/share.dto';

@Injectable()
export class ShareService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly permissionsService: PermissionsService,
		private readonly shareRepository: ShareRepository,
	) {}

	async getResourcePermissions(userId: number, resourceType: ResourceType, resourceId: number) {
		const userRole = await this.permissionsService.getUserRole(userId, resourceId, resourceType);
		if (!userRole) {
			throw new ForbiddenException('No access to resource');
		}

		const ancestors = await this.permissionsService.getAncestorsPath(resourceId, resourceType);
		const ancestorIds = ancestors.map((a) => a.id);

		const permissions = await this.prisma.permission.findMany({
			where: {
				OR: [
					{ resourceType, resourceId },
					{ resourceType: 'FOLDER', resourceId: { in: ancestorIds } },
				],
			},
			include: {
				user: {
					select: { id: true, email: true, fullName: true },
				},
			},
			orderBy: { createdAt: 'desc' },
		});

		const ownerId = await this.permissionsService.getResourceOwnerId(resourceId, resourceType);

		let owner: { id: number; email: string; fullName: string | null } | null = null;
		if (ownerId) {
			owner = await this.prisma.user.findUnique({
				where: { id: ownerId },
				select: { id: true, email: true, fullName: true },
			});
		}

		const mappedPermissions = permissions.map((p) => ({
			id: p.id,
			userId: p.userId,
			resourceType: p.resourceType,
			resourceId: p.resourceId,
			role: p.role,
			createdAt: p.createdAt.toISOString(),
			user: p.user,
			inherited: !(p.resourceType === resourceType && p.resourceId === resourceId),
		}));

		const apiUserRole = userRole === 'OWNER' ? 'EDITOR' : userRole;

		return {
			permissions: mappedPermissions,
			userRole: apiUserRole,
			owner,
			currentUserId: userId,
		};
	}

	async getSharedWithMe(userId: number) {
		const [files, folders] = await Promise.all([
			this.shareRepository.findSharedFiles(userId),
			this.shareRepository.findSharedFolders(userId),
		]);

		const resultFiles = files.map((f) => ({
			...f,
			type: 'FILE',
			resourceType: 'FILE',
		}));

		const resultFolders = folders.map((f) => ({
			...f,
			type: 'FOLDER',
			resourceType: 'FOLDER',
		}));

		return { files: resultFiles, folders: resultFolders };
	}

	async inviteUser(requesterId: number, dto: InviteUserDto) {
		const { resourceType, resourceId, email, role } = dto;

		await this.ensureCanManage(requesterId, resourceType, resourceId);

		const invitee = await this.prisma.user.findUnique({ where: { email } });
		if (!invitee) {
			throw new BadRequestException(`User with email ${email} not found`);
		}

		if (invitee.id === requesterId) {
			throw new BadRequestException('You cannot grant access to yourself');
		}

		const ownerId = await this.permissionsService.getResourceOwnerId(resourceId, resourceType);
		if (ownerId === invitee.id) {
			throw new BadRequestException('The user is already the owner of this resource');
		}

		return this.prisma.permission.upsert({
			where: {
				resourceType_resourceId_userId: {
					resourceType,
					resourceId,
					userId: invitee.id,
				},
			},
			update: { role },
			create: {
				resourceType,
				resourceId,
				userId: invitee.id,
				role,
			},
			include: {
				user: { select: { id: true, email: true, fullName: true } },
			},
		});
	}

	async changeRole(requesterId: number, permissionId: number, newRole: ShareRole) {
		const permission = await this.prisma.permission.findUnique({
			where: { id: permissionId },
		});

		if (!permission) throw new NotFoundException('Access right not found');

		await this.ensureCanManage(requesterId, permission.resourceType, permission.resourceId);

		return this.prisma.permission.update({
			where: { id: permissionId },
			data: { role: newRole },
			include: { user: { select: { id: true, email: true, fullName: true } } },
		});
	}

	async revokeAccess(requesterId: number, permissionId: number) {
		const permission = await this.prisma.permission.findUnique({
			where: { id: permissionId },
		});

		if (!permission) throw new NotFoundException('Access right not found');

		await this.ensureCanManage(requesterId, permission.resourceType, permission.resourceId);

		await this.prisma.permission.delete({ where: { id: permissionId } });

		return { success: true };
	}

	private async ensureCanManage(userId: number, type: ResourceType, id: number) {
		const hasPermission = await this.permissionsService.checkAccess(userId, id, type, 'EDITOR');

		if (!hasPermission) {
			throw new ForbiddenException('Insufficient rights to manage access');
		}
	}
}
