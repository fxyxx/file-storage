import { Loader2, Home } from 'lucide-react';
import { ItemList } from '../item';
import { Button } from '@/components/ui/button';
import { useFileBrowser } from '../../hooks/useFileBrowser';
import { BrowserToolbar } from './BrowserToolbar';
import { SharedFilesSection } from './SharedFilesSection';

export const FileBrowser = () => {
	const {
		parsedFolderId,
		isRoot,
		viewMode,
		setViewMode,
		fileInputRef,
		handleFileSelect,
		handleUploadClick,
		data,
		isLoading,
		error,
		sharedData,
		sharedLoading,
		handleGoBack,
		handleGoHome,
	} = useFileBrowser();

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-64 flex-col items-center justify-center text-center">
				<p className="text-destructive">Failed to load folder contents</p>
				<Button variant="outline" className="mt-4" onClick={handleGoHome}>
					<Home className="mr-2 h-4 w-4" />
					Home
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<BrowserToolbar
				folderId={parsedFolderId}
				onGoBack={handleGoBack}
				onUploadClick={handleUploadClick}
				fileInputRef={fileInputRef}
				onFileSelect={handleFileSelect}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
			/>
			{data && <ItemList folders={data.folders} files={data.files} viewMode={viewMode} />}
			{isRoot && <SharedFilesSection isLoading={sharedLoading} data={sharedData} viewMode={viewMode} />}
		</div>
	);
};
