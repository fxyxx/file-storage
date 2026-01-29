import { ChevronLeft, LayoutGrid, List, Upload } from 'lucide-react';
import { type ChangeEvent, type RefObject } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { Button } from '@/components/ui/button';
import { CreateFolderDialog } from '../dialogs';

interface BrowserToolbarProps {
	folderId: number | null;
	onGoBack: () => void;
	onUploadClick: () => void;
	fileInputRef: RefObject<HTMLInputElement | null>;
	onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
	viewMode: 'grid' | 'list';
	onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const BrowserToolbar = ({
	folderId,
	onGoBack,
	onUploadClick,
	fileInputRef,
	onFileSelect,
	viewMode,
	onViewModeChange,
}: BrowserToolbarProps) => {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				{folderId && (
					<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onGoBack} title="Назад">
						<ChevronLeft className="h-5 w-5" />
					</Button>
				)}

				{folderId && <div className="bg-border h-6 w-px" />}

				<Breadcrumbs folderId={folderId} />
			</div>

			<div className="flex items-center gap-2">
				<CreateFolderDialog parentId={folderId} />

				<Button variant="outline" size="sm" onClick={onUploadClick}>
					<Upload className="mr-2 h-4 w-4" />
					Upload
				</Button>

				<input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFileSelect} />

				<div className="flex items-center gap-1 rounded-lg border p-1">
					<Button
						variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
						size="sm"
						onClick={() => onViewModeChange('grid')}
						className="h-8 w-8 p-0"
					>
						<LayoutGrid className="h-4 w-4" />
					</Button>
					<Button
						variant={viewMode === 'list' ? 'secondary' : 'ghost'}
						size="sm"
						onClick={() => onViewModeChange('list')}
						className="h-8 w-8 p-0"
					>
						<List className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
