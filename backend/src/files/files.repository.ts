import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { File, Prisma } from '@prisma/client';

export interface CreateFileData {
	filename: string;
	originalName: string;
	size: number;
	mimetype: string;
	s3Path: string;
	userId: number;
	folderId: number | null;
}

@Injectable()
export class FilesRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateFileData): Promise<File> {
		return this.prisma.file.create({ data });
	}

	async findById(id: number): Promise<File | null> {
		return this.prisma.file.findUnique({ where: { id } });
	}

	async findByIds(ids: number[]): Promise<File[]> {
		return this.prisma.file.findMany({ where: { id: { in: ids } } });
	}

	async findByFolderId(folderId: number | null, userId?: number): Promise<File[]> {
		const where: Prisma.FileWhereInput = { folderId };
		if (userId !== undefined) {
			where.userId = userId;
		}
		return this.prisma.file.findMany({
			where,
			orderBy: { createdAt: 'desc' },
		});
	}

	async update(id: number, data: Partial<Pick<File, 'originalName' | 'folderId'>>): Promise<File> {
		return this.prisma.file.update({ where: { id }, data });
	}

	async deleteMany(ids: number[]): Promise<{ count: number }> {
		return this.prisma.file.deleteMany({ where: { id: { in: ids } } });
	}
}
