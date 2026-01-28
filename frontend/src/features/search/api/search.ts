import { api } from '@/api/axios';
import type { SearchResult } from '../types';

export const searchResources = async (query: string): Promise<SearchResult[]> => {
	const response = await api.get<SearchResult[]>('/search', {
		params: { q: query },
	});
	return response.data;
};
