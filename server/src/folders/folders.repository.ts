import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Folder, Prisma } from '@prisma/client';

@Injectable()
export class FoldersRepository {
	private readonly logger = new Logger(FoldersRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	async findByParentId(parentId: number | null, userId?: number): Promise<Folder[]> {
		const where: Prisma.FolderWhereInput = { parentId };
		if (userId !== undefined) {
			where.userId = userId;
		}
		return this.prisma.folder.findMany({
			where,
			orderBy: { name: 'asc' },
		});
	}

	async findAllS3KeysInFolderRecursively(folderId: number): Promise<string[]> {
		this.logger.debug(`Finding S3 keys for folder ${folderId}`);

		const s3Keys: string[] = [];
		await this.collectS3KeysRecursively(folderId, s3Keys);

		this.logger.debug(`Found ${s3Keys.length} S3 keys: ${JSON.stringify(s3Keys)}`);

		return s3Keys;
	}

	private async collectS3KeysRecursively(folderId: number, s3Keys: string[]): Promise<void> {
		// Get files in current folder
		const files = await this.prisma.file.findMany({
			where: { folderId },
			select: { s3Path: true },
		});

		for (const file of files) {
			s3Keys.push(file.s3Path);
		}

		// Get child folders and process them recursively
		const childFolders = await this.prisma.folder.findMany({
			where: { parentId: folderId },
			select: { id: true },
		});

		for (const childFolder of childFolders) {
			await this.collectS3KeysRecursively(childFolder.id, s3Keys);
		}
	}
}
