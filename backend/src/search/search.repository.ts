import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface SearchRawResult {
	id: number;
	name: string;
	type: 'FILE' | 'FOLDER';
	folderId: number | null;
}

export interface PathRawResult {
	startId: number;
	pathJson: string;
}

@Injectable()
export class SearchRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findAccessibleResources(userId: number, query: string, limit: number = 50): Promise<SearchRawResult[]> {
		const searchTerm = `%${query}%`;

		return this.prisma.$queryRaw<SearchRawResult[]>`
			WITH RECURSIVE "AccessibleFolders" AS (SELECT id, "name", "parentId", "userId"
												   FROM "Folder"
												   WHERE "userId" = ${userId}

												   UNION

												   SELECT f.id, f."name", f."parentId", f."userId"
												   FROM "Folder" f
															INNER JOIN "Permission" p ON p."resourceId" = f.id
												   WHERE p."userId" = ${userId}
													 AND p."resourceType" = 'FOLDER'

												   UNION

												   SELECT child.id, child."name", child."parentId", child."userId"
												   FROM "Folder" child
															INNER JOIN "AccessibleFolders" parent ON child."parentId" = parent.id)

			SELECT f.id,
				   f."originalName" as name,
				   'FILE'::text     as type,
				   f."folderId"
			FROM "File" f
			WHERE f."originalName" ILIKE ${searchTerm}
			  AND (
				f."userId" = ${userId}
					OR
				f.id IN (SELECT "resourceId" FROM "Permission" WHERE "userId" = ${userId} AND "resourceType" = 'FILE')
					OR f."folderId" IN (SELECT id FROM "AccessibleFolders")
				)

			UNION ALL

			SELECT af.id,
				   af."name",
				   'FOLDER'::text as type,
				   af."parentId"  as "folderId"
			FROM "AccessibleFolders" af
			WHERE af."name" ILIKE ${searchTerm}

			ORDER BY name
			LIMIT ${limit};
		`;
	}

	async getPathsForFolders(folderIds: number[]): Promise<Map<number, Array<{ id: number; name: string }>>> {
		if (folderIds.length === 0) return new Map();

		const uniqueIds = Array.from(new Set(folderIds));

		const rows = await this.prisma.$queryRaw<PathRawResult[]>`
			WITH RECURSIVE path_tree AS (SELECT id as "startId",
												id,
												"parentId",
												"name",
												1  as depth
										 FROM "Folder"
										 WHERE id IN (${Prisma.join(uniqueIds)})

										 UNION ALL

										 SELECT pt."startId",
												parent.id,
												parent."parentId",
												parent."name",
												pt.depth + 1
										 FROM "Folder" parent
												  INNER JOIN path_tree pt ON pt."parentId" = parent.id)
			SELECT "startId",
				   json_agg(json_build_object('id', id, 'name', "name") ORDER BY depth DESC) as "pathJson"
			FROM path_tree
			GROUP BY "startId";
		`;

		const resultMap = new Map<number, Array<{ id: number; name: string }>>();

		rows.forEach((row) => {
			const parsedPath = typeof row.pathJson === 'string' ? JSON.parse(row.pathJson) : row.pathJson;
			resultMap.set(row.startId, parsedPath);
		});

		return resultMap;
	}
}
