export type UploadStatus = 'pending' | 'uploading' | 'done' | 'error';

export interface UploadItem {
	id: string;
	file: File;
	progress: number;
	status: UploadStatus;
	folderId: number | null;
	error?: string;
}
