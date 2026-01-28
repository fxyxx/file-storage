import { type UploadItem, useUploadStore } from '@/features/upload';
import { AlertCircle, Check, Upload, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export const UploadItemRow = ({ item }: { item: UploadItem }) => {
	const removeUpload = useUploadStore((state) => state.removeUpload);

	const statusIcon = {
		pending: <Upload className="text-muted-foreground h-4 w-4 animate-pulse" />,
		uploading: <Upload className="h-4 w-4 animate-bounce text-blue-500" />,
		done: <Check className="h-4 w-4 text-green-500" />,
		error: <AlertCircle className="text-destructive h-4 w-4" />,
	};

	return (
		<div className="flex items-center gap-3 py-2">
			<div className="shrink-0">{statusIcon[item.status]}</div>
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium" title={item.file.name}>
					{item.file.name}
				</p>
				{item.status === 'uploading' && <Progress value={item.progress} className="mt-1 h-1" />}
				{item.status === 'error' && <p className="text-destructive text-xs">{item.error || 'Loading error'}</p>}
			</div>
			<Button variant="ghost" size="sm" className="h-6 w-6 shrink-0 p-0" onClick={() => removeUpload(item.id)}>
				<X className="h-3 w-3" />
			</Button>
		</div>
	);
};
