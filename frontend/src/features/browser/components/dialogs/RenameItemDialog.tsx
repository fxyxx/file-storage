import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModalStore } from '@/store/useModalStore';
import { RenameForm } from '../item/RenameForm';

export const RenameItemDialog = () => {
	const { isOpen, view, data, closeModal } = useModalStore();
	const isVisible = isOpen && view === 'RENAME_ITEM';

	if (!isVisible || !data) return null;

	return (
		<Dialog open={isVisible} onOpenChange={(open) => !open && closeModal()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rename {data.type === 'FOLDER' ? 'Folder' : 'File'}</DialogTitle>
					<DialogDescription>Enter a new name for this {data.type}.</DialogDescription>
				</DialogHeader>
				<RenameForm data={data} closeModal={closeModal} />
			</DialogContent>
		</Dialog>
	);
};
