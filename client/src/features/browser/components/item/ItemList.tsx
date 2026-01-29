import type { FileSystemItem, ViewMode } from '../../types/item';
import { ItemCard } from './ItemCard';
import { ItemRow } from './ItemRow.tsx';
import { FolderPlus } from 'lucide-react';

interface ItemListProps {
	folders: FileSystemItem[];
	files: FileSystemItem[];
	viewMode: ViewMode;
}

export const ItemList = ({ folders, files, viewMode }: ItemListProps) => {
	const isEmpty = folders.length === 0 && files.length === 0;

	if (isEmpty) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<div className="bg-muted mb-4 rounded-full p-4">
					<FolderPlus className="text-muted-foreground h-10 w-10" />
				</div>
				<h3 className="text-lg font-medium">The folder is empty</h3>
				<p className="text-muted-foreground mt-1 text-sm">Upload files or create a folder</p>
			</div>
		);
	}

	if (viewMode === 'list') {
		return (
			<div className="space-y-2">
				<div className="text-muted-foreground hidden items-center gap-4 px-4 py-2 text-xs font-medium uppercase sm:flex">
					<div className="w-10 shrink-0" />
					<div className="min-w-0 flex-1">Name</div>
					<div className="hidden w-24 shrink-0 text-right sm:block">Size</div>
					<div className="hidden w-32 shrink-0 text-right md:block">Date</div>
					<div className="w-8 shrink-0" />
				</div>

				{folders.map((folder) => (
					<ItemRow key={`folder-${folder.id}`} item={folder} userRole={folder.userRole} />
				))}

				{files.map((file) => (
					<ItemRow key={`file-${file.id}`} item={file} userRole={file.userRole} />
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
			{folders.map((folder) => (
				<ItemCard key={`folder-${folder.id}`} item={folder} userRole={folder.userRole} />
			))}

			{files.map((file) => (
				<ItemCard key={`file-${file.id}`} item={file} userRole={file.userRole} />
			))}
		</div>
	);
};
