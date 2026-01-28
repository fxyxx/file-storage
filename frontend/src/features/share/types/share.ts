import type { UserRole } from '@/types/user';
import type { FileType, FolderType } from '@/types/resource';

export type ShareRole = 'VIEWER' | 'EDITOR';

export interface SharedFile {
	id: number;
	type: FileType;
	filename: string;
	originalName: string;
	size: number;
	mimetype: string;
	s3Path: string;
	folderId: number | null;
	userId: number;
	createdAt: string;
	userRole: UserRole;
	owner: { id: number; email: string; fullName: string | null };
}

export interface SharedFolder {
	id: number;
	type: FolderType;
	name: string;
	parentId: number | null;
	userId: number;
	createdAt: string;
	userRole: UserRole;
	owner: { id: number; email: string; fullName: string | null };
}

export interface SharedWithMeResponse {
	files: SharedFile[];
	folders: SharedFolder[];
}
