import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModalStore } from '@/store/useModalStore';
import { useQuery } from '@tanstack/react-query';
import { Loader2, FileIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/utils';
import { getFilePreview } from '../../api/contents';

export const PreviewFileDialog = () => {
	const { isOpen, view, data, closeModal } = useModalStore();

	const isVisible = isOpen && view === 'PREVIEW_FILE';
	const fileId = data?.id;

	const {
		data: fileData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['file-preview', fileId],
		queryFn: () => getFilePreview(fileId!),
		enabled: isVisible && !!fileId,
		staleTime: 5 * 60 * 1000,
	});

	if (!isVisible) return null;

	const renderContent = () => {
		if (isLoading) {
			return (
				<div className="flex h-60 items-center justify-center">
					<Loader2 className="text-primary h-8 w-8 animate-spin" />
				</div>
			);
		}

		if (error || !fileData) {
			return (
				<div className="text-destructive flex h-60 items-center justify-center">Failed to load preview.</div>
			);
		}

		const { mimetype, url, name, size } = fileData;

		if (mimetype.startsWith('image/')) {
			return (
				<div className="flex h-full w-full items-center justify-center bg-black/5 p-4">
					<img src={url} alt={name} className="max-h-[80vh] max-w-full rounded-md object-contain shadow-lg" />
				</div>
			);
		}

		if (mimetype.startsWith('video/')) {
			return (
				<div className="flex h-full w-full items-center justify-center bg-black">
					<video controls autoPlay className="max-h-[80vh] max-w-full">
						<source src={url} type={mimetype} />
						Your browser does not support the video tag.
					</video>
				</div>
			);
		}

		if (mimetype === 'application/pdf') {
			return <iframe src={url} className="h-[80vh] w-full rounded-md border shadow-sm" title={name} />;
		}

		return (
			<div className="flex h-[50vh] flex-col items-center justify-center gap-6 text-center">
				<div className="bg-muted rounded-full p-6">
					<FileIcon className="text-muted-foreground h-16 w-16" />
				</div>
				<div className="space-y-2">
					<h3 className="text-xl font-semibold">{name}</h3>
					<p className="text-muted-foreground text-sm">
						{formatBytes ? formatBytes(size) : `${(size / 1024 / 1024).toFixed(2)} MB`}
					</p>
				</div>
				<Button size="lg" asChild className="gap-2">
					<a href={url} download={name} target="_blank" rel="noopener noreferrer">
						<Download className="h-5 w-5" />
						Download
					</a>
				</Button>
			</div>
		);
	};

	return (
		<Dialog open={isVisible} onOpenChange={(open) => !open && closeModal()}>
			<DialogContent className="max-w-4xl overflow-hidden p-0 sm:max-w-5xl">
				<DialogHeader className="absolute top-4 right-4 z-50">
					<DialogTitle className="sr-only">Preview {data?.name}</DialogTitle>
				</DialogHeader>
				{renderContent()}
			</DialogContent>
		</Dialog>
	);
};
