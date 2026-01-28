import { api } from '@/api/axios';
import type { FileItem } from '@/features/browser';

export type UploadFileResult = FileItem;

export const uploadFile = async (
	file: File,
	folderId: number | null,
	onProgress?: (progress: number) => void,
): Promise<UploadFileResult> => {
	const formData = new FormData();
	formData.append('file', file);

	const response = await api.post<UploadFileResult>('/files/upload', formData, {
		params: folderId ? { folderId } : undefined,
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		onUploadProgress: (progressEvent) => {
			if (progressEvent.total && onProgress) {
				const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
				onProgress(progress);
			}
		},
	});

	return response.data;
};
