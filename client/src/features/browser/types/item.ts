import type { UserRole } from '@/types/user';
import type { FileType, FolderType } from '@/types/resource';

interface BaseItem {
	id: number;
	createdAt: string;
	userId: number;
}

export interface FolderItem extends BaseItem {
	type: FolderType;
	name: string;
	parentId: number | null;
	userRole?: UserRole;
}

export interface FileItem extends BaseItem {
	type: FileType;
	filename: string;
	originalName: string;
	size: number;
	mimetype: string;
	s3Path: string;
	folderId: number | null;
	userRole?: UserRole;
}

export type FileSystemItem = FileItem | FolderItem;

export interface FolderContentsResponse {
	folders: FolderItem[];
	files: FileItem[];
	userRole?: UserRole;
}

export interface CreateFolderDto {
	name: string;
	parentId?: number | null;
}

export interface FolderWithPath extends FolderItem {
	path: FolderItem[];
}

export type ViewMode = 'grid' | 'list';

export interface PreviewData {
	url: string;
	mimetype: string;
	name: string;
	size: number;
}
