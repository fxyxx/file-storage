import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModalStore } from '@/store/useModalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { renameItem } from '../../api/items';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, type FormEvent } from 'react';

export const RenameItemDialog = () => {
	const { isOpen, view, data, closeModal } = useModalStore();
	const queryClient = useQueryClient();
	const [name, setName] = useState('');
	const [error, setError] = useState('');

	const isVisible = isOpen && view === 'RENAME_ITEM';

	useEffect(() => {
		if (isVisible && data?.name) {
			setName(data.name);
			setError('');
		}
	}, [isVisible, data?.name]);

	const renameMutation = useMutation({
		mutationFn: () => renameItem(data!.type, data!.id, name.trim()),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['files'] });
			queryClient.invalidateQueries({ queryKey: ['shared-with-me'] });
			closeModal();
		},
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			setError('Name cannot be empty');
			return;
		}

		if (!data) return;
		renameMutation.mutate();
	};

	if (!isVisible) return null;

	return (
		<Dialog open={isVisible} onOpenChange={(open) => !open && closeModal()}>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Rename {data?.type === 'FOLDER' ? 'Folder' : 'File'}</DialogTitle>
						<DialogDescription>Enter a new name for this {data?.type}.</DialogDescription>
					</DialogHeader>

					<div className="my-4 space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								setError('');
							}}
							placeholder="Enter new name..."
							autoFocus
						/>
						{error && <p className="text-destructive text-sm">{error}</p>}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={closeModal}
							disabled={renameMutation.isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={renameMutation.isPending || !name.trim()}>
							{renameMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Rename
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
