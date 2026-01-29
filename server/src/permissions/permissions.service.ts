import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShareRole, ResourceType } from '@prisma/client';

export interface PathNode {
	id: number;
	parentId: number | null;
	userId: number;
	name: string;
}

@Injectable()
export class PermissionsService {
	constructor(private readonly prisma: PrismaService) {}

	async checkAccess(
		userId: number,
		resourceId: number,
		type: ResourceType,
		requiredRole?: ShareRole,
	): Promise<boolean> {
		const isOwner = await this.isOwner(userId, resourceId, type);
		if (isOwner) return true;

		const path = await this.getAncestorsPath(resourceId, type);
		const resourceIds = path.map((node) => node.id);

		const permissions = await this.prisma.permission.findMany({
			where: {
				userId,
				OR: [
					{ resourceType: type, resourceId: resourceId },
					{ resourceType: 'FOLDER', resourceId: { in: resourceIds } },
				],
			},
		});

		if (permissions.length === 0) return false;

		if (!requiredRole) return true;

		return permissions.some((p) => {
			if (p.role === 'EDITOR') return true;
			return p.role === requiredRole;
		});
	}

	async getResourceOwnerId(resourceId: number, type: ResourceType): Promise<number | null> {
		if (type === 'FOLDER') {
			const folder = await this.prisma.folder.findUnique({
				where: { id: resourceId },
				select: { userId: true },
			});
			return folder?.userId || null;
		} else {
			const file = await this.prisma.file.findUnique({
				where: { id: resourceId },
				select: { userId: true },
			});
			return file?.userId || null;
		}
	}

	async isOwner(userId: number, resourceId: number, type: ResourceType): Promise<boolean> {
		const ownerId = await this.getResourceOwnerId(resourceId, type);
		return ownerId === userId;
	}

	public async getAncestorsPath(resourceId: number, type: ResourceType): Promise<PathNode[]> {
		let startFolderId: number | null = resourceId;

		if (type === 'FILE') {
			const file = await this.prisma.file.findUnique({
				where: { id: resourceId },
				select: { folderId: true },
			});
			if (!file) return [];
			startFolderId = file.folderId;
		}

		if (!startFolderId) return [];

		const result = await this.prisma.$queryRaw<PathNode[]>`
			WITH RECURSIVE path_tree AS (
				SELECT id, "parentId", "userId", "name", 1 as depth
				FROM "Folder"
				WHERE id = ${startFolderId}
				UNION ALL
				SELECT f.id, f."parentId", f."userId", f."name", pt.depth + 1
				FROM "Folder" f
				INNER JOIN path_tree pt ON f.id = pt."parentId"
			)
			SELECT id, "parentId", "userId", "name" FROM path_tree ORDER BY depth DESC;
		`;

		if (type === 'FOLDER') {
			return result.filter((node) => node.id !== resourceId);
		}

		return result;
	}

	async getUserRole(userId: number, resourceId: number, type: ResourceType): Promise<'OWNER' | ShareRole | null> {
		const isOwner = await this.isOwner(userId, resourceId, type);
		if (isOwner) return 'OWNER';

		const path = await this.getAncestorsPath(resourceId, type);
		const ancestorIds = path.map((node) => node.id);

		const permissions = await this.prisma.permission.findMany({
			where: {
				userId,
				OR: [
					{ resourceType: type, resourceId },
					{ resourceType: 'FOLDER', resourceId: { in: ancestorIds } },
				],
			},
		});

		if (permissions.length === 0) return null;

		const directPermission = permissions.find((p) => p.resourceType === type && p.resourceId === resourceId);
		if (directPermission) return directPermission.role;

		if (permissions.some((p) => p.role === 'EDITOR')) return 'EDITOR';
		return 'VIEWER';
	}
}
