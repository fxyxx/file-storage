import { DeleteItemDialog } from './DeleteItemDialog';
import { RenameItemDialog } from './RenameItemDialog';
import { ShareDialog } from '@/features/share';

import { PreviewFileDialog } from './PreviewFileDialog';

export const ModalManager = () => {
	return (
		<>
			<DeleteItemDialog />
			<RenameItemDialog />
			<ShareDialog />
			<PreviewFileDialog />
		</>
	);
};
