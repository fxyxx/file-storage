import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/store/useModalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItem } from '../../api/items';
import { Loader2 } from 'lucide-react';

export const DeleteItemDialog = () => {
	const { isOpen, view, data, closeModal } = useModalStore();
	const queryClient = useQueryClient();

	const isVisible = isOpen && view === 'DELETE_ITEM';

	const deleteMutation = useMutation({
		mutationFn: () => deleteItem(data!.type, data!.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['files'] });
			queryClient.invalidateQueries({ queryKey: ['shared-with-me'] });
			closeModal();
		},
	});

	const handleDelete = () => {
		if (!data) return;
		deleteMutation.mutate();
	};

	if (!isVisible) return null;

	return (
		<Dialog open={isVisible} onOpenChange={(open) => !open && closeModal()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-destructive">
						Delete {data?.type === 'FOLDER' ? 'Folder' : 'File'}
					</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete{' '}
						<span className="text-foreground font-semibold">"{data?.name}"</span>?
						{data?.type === 'FOLDER' && (
							<span className="text-destructive mt-2 block">
								This will also delete all files and subfolders inside.
							</span>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={closeModal} disabled={deleteMutation.isPending}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
						{deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
