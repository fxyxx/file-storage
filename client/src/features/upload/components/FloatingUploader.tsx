import { useQueryClient } from '@tanstack/react-query';
import { Upload, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useUploadStore } from '../store/useUploadStore';
import { uploadFile } from '../api/upload';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useRef } from 'react';
import { UploadItemRow } from './UploadItemRow';

export const FloatingUploader = () => {
	const uploads = useUploadStore((state) => state.uploads);
	const isMinimized = useUploadStore((state) => state.isMinimized);
	const setMinimized = useUploadStore((state) => state.setMinimized);
	const clearCompleted = useUploadStore((state) => state.clearCompleted);
	const updateProgress = useUploadStore((state) => state.updateProgress);
	const setStatus = useUploadStore((state) => state.setStatus);

	const queryClient = useQueryClient();
	const processingRef = useRef<Set<string>>(new Set());

	const processQueue = useCallback(() => {
		const pendingUploads = uploads.filter((u) => u.status === 'pending' && !processingRef.current.has(u.id));

		pendingUploads.forEach((upload) => {
			processingRef.current.add(upload.id);

			uploadFile(upload.file, upload.folderId, (progress) => {
				updateProgress(upload.id, progress);
			})
				.then(() => {
					setStatus(upload.id, 'done');
					queryClient.invalidateQueries({ queryKey: ['files', upload.folderId] });
				})
				.catch((error) => {
					const message = error instanceof Error ? error.message : 'Loading failed.';
					setStatus(upload.id, 'error', message);
				})
				.finally(() => {
					processingRef.current.delete(upload.id);
				});
		});
	}, [uploads, updateProgress, setStatus, queryClient]);

	useEffect(() => {
		processQueue();
	}, [processQueue]);

	if (uploads.length === 0) {
		return null;
	}

	const completedCount = uploads.filter((u) => u.status === 'done').length;
	const activeCount = uploads.filter((u) => u.status === 'uploading' || u.status === 'pending').length;

	return (
		<div className="bg-card fixed right-4 bottom-4 z-50 w-80 overflow-hidden rounded-lg border shadow-lg">
			<div
				className="bg-muted/50 flex cursor-pointer items-center justify-between px-4 py-3"
				onClick={() => setMinimized(!isMinimized)}
			>
				<div className="flex items-center gap-2">
					<Upload className="h-4 w-4" />
					<span className="text-sm font-medium">
						{activeCount > 0 ? `Loading: ${activeCount}` : `Completed: ${completedCount}`}
					</span>
				</div>
				<div className="flex items-center gap-1">
					{completedCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0"
							onClick={(e) => {
								e.stopPropagation();
								clearCompleted();
							}}
						>
							<Trash2 className="h-3 w-3" />
						</Button>
					)}
					{isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
				</div>
			</div>

			{!isMinimized && (
				<div className="max-h-64 divide-y overflow-y-auto px-4">
					{uploads.map((item) => (
						<UploadItemRow key={item.id} item={item} />
					))}
				</div>
			)}
		</div>
	);
};
