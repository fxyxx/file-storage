import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShareRole } from '@prisma/client';

export interface SharedFile {
	id: number;
	filename: string;
	originalName: string;
	size: number;
	mimetype: string;
	s3Path: string;
	folderId: number | null;
	userId: number;
	createdAt: Date;
	updatedAt: Date;
	user: { id: number; fullName: string | null };
	userRole: ShareRole;
}

export interface SharedFolder {
	id: number;
	name: string;
	parentId: number | null;
	userId: number;
	createdAt: Date;
	updatedAt: Date;
	user: { id: number; fullName: string | null };
	userRole: ShareRole;
}

@Injectable()
export class ShareRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findSharedFiles(userId: number): Promise<SharedFile[]> {
		const permissions = await this.prisma.permission.findMany({
			where: { userId, resourceType: 'FILE' },
			select: { resourceId: true, role: true },
		});

		if (permissions.length === 0) return [];

		const fileIds = permissions.map((p) => p.resourceId);
		const roleMap = new Map(permissions.map((p) => [p.resourceId, p.role]));

		const files = await this.prisma.file.findMany({
			where: { id: { in: fileIds } },
			include: { user: { select: { id: true, fullName: true } } },
		});

		return files.map((f) => ({
			...f,
			userRole: roleMap.get(f.id)!,
		}));
	}

	async findSharedFolders(userId: number): Promise<SharedFolder[]> {
		const permissions = await this.prisma.permission.findMany({
			where: { userId, resourceType: 'FOLDER' },
			select: { resourceId: true, role: true },
		});

		if (permissions.length === 0) return [];

		const folderIds = permissions.map((p) => p.resourceId);
		const roleMap = new Map(permissions.map((p) => [p.resourceId, p.role]));

		const folders = await this.prisma.folder.findMany({
			where: { id: { in: folderIds } },
			include: { user: { select: { id: true, fullName: true } } },
		});

		return folders.map((f) => ({
			...f,
			userRole: roleMap.get(f.id)!,
		}));
	}
}
