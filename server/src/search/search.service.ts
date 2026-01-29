import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import { SearchResultDto } from './dto/search.dto';

@Injectable()
export class SearchService {
	constructor(private readonly searchRepository: SearchRepository) {}

	async search(userId: number, query: string): Promise<SearchResultDto[]> {
		const rawResults = await this.searchRepository.findAccessibleResources(userId, query);

		if (rawResults.length === 0) {
			return [];
		}

		const folderIdsToFetch = rawResults.map((item) => item.folderId).filter((id): id is number => id !== null);

		const pathsMap = await this.searchRepository.getPathsForFolders(folderIdsToFetch);

		return rawResults.map((item) => {
			const lookupId = item.folderId;
			const path = (lookupId && pathsMap.get(lookupId)) || [];

			return {
				id: item.id,
				name: item.name,
				type: item.type,
				path: path,
			};
		});
	}
}
