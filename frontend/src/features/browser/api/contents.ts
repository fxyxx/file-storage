import { api } from '@/api/axios';
import type { FolderContentsResponse, PreviewData } from '../types/item';

export const getContents = async (folderId?: number | null): Promise<FolderContentsResponse> => {
	const params = folderId ? { parentId: folderId } : {};
	const { data } = await api.get<FolderContentsResponse>('/folders', { params });
	return data;
};

export const getFilePreview = async (id: number): Promise<PreviewData> => {
	const { data } = await api.get<PreviewData>(`/files/${id}/view`);
	return data;
};
