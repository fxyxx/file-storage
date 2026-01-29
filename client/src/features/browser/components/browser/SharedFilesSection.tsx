import { Loader2, Users } from 'lucide-react';
import { ItemList } from '../item';
import type { FolderItem, FileItem } from '../../types/item';

interface SharedData {
	folders: FolderItem[];
	files: FileItem[];
}

interface SharedFilesSectionProps {
	isLoading: boolean;
	data: SharedData | undefined;
	viewMode: 'grid' | 'list';
}

export const SharedFilesSection = ({ isLoading, data, viewMode }: SharedFilesSectionProps) => {
	const hasItems = data && (data.files.length > 0 || data.folders.length > 0);

	if (!isLoading && !hasItems) return null;

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 border-t pt-6">
				<Users className="text-muted-foreground h-5 w-5" />
				<h2 className="text-lg font-semibold">Available to me</h2>
			</div>
			{isLoading ? (
				<div className="flex h-32 items-center justify-center">
					<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
				</div>
			) : (
				data && <ItemList folders={data.folders} files={data.files} viewMode={viewMode} />
			)}
		</div>
	);
};
