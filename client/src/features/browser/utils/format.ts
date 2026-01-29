import type { FileSystemItem } from '../types/item';

export const getDisplayName = (item: FileSystemItem): string => {
	return item.type === 'FOLDER' ? item.name : item.originalName;
};
