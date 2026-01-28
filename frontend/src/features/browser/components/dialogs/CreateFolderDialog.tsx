import { type FormEvent, type ReactNode, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderPlus, Loader2 } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFolder } from '../../api/folders';

interface CreateFolderDialogProps {
	parentId: number | null;
	trigger?: ReactNode;
}

export const CreateFolderDialog = ({ parentId, trigger }: CreateFolderDialogProps) => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [error, setError] = useState<string | null>(null);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () => createFolder({ name: name.trim(), parentId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['files', parentId] });
			setOpen(false);
			setName('');
			setError(null);
		},
		onError: (err: Error & { response?: { data?: { message?: string } } }) => {
			setError(err.response?.data?.message || 'Failed to create folder');
		},
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			setError('Enter the folder name');
			return;
		}
		setError(null);
		mutation.mutate();
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setName('');
			setError(null);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant="outline" size="sm">
						<FolderPlus className="mr-2 h-4 w-4" />
						New folder
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create a folder</DialogTitle>
						<DialogDescription>Enter a name for the new folder</DialogDescription>
					</DialogHeader>
					<div className="mt-4 space-y-4">
						<div className="space-y-2">
							<Label htmlFor="folder-name">Name</Label>
							<Input
								id="folder-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="New folder"
								autoFocus
								disabled={mutation.isPending}
							/>
							{error && <p className="text-destructive text-sm">{error}</p>}
						</div>
					</div>
					<DialogFooter className="mt-6">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={mutation.isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Create
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
