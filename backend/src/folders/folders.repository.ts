import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Folder, Prisma } from '@prisma/client';

@Injectable()
export class FoldersRepository {
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
		const files = await this.prisma.$queryRaw<Array<{ s3Path: string }>>`
			WITH RECURSIVE folder_tree AS (SELECT id
										   FROM "Folder"
										   WHERE id = ${folderId}

										   UNION ALL

										   SELECT f.id
										   FROM "Folder" f
													INNER JOIN folder_tree ft ON f."parentId" = ft.id)
			SELECT "s3Path"
			FROM "File"
			WHERE "folderId" IN (SELECT id FROM folder_tree);
		`;

		return files.map((f) => f.s3Path);
	}
}
