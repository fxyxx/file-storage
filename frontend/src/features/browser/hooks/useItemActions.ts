import { useNavigate } from 'react-router-dom';
import { useModalStore } from '@/store/useModalStore';
import type { FileSystemItem, FileItem } from '../types/item';
import type { UserRole } from '@/types/user';
import { getDisplayName } from '../utils/format';
import { copyItem } from '../api/items';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseItemActionsProps {
	item: FileSystemItem;
	userRole?: UserRole;
}

export const useItemActions = ({ item, userRole = 'OWNER' }: UseItemActionsProps) => {
	const navigate = useNavigate();
	const openModal = useModalStore((state) => state.openModal);
	const queryClient = useQueryClient();
	const { type } = item;

	const isOwner = userRole === 'OWNER';
	const isEditor = userRole === 'EDITOR';
	const isViewer = userRole === 'VIEWER';

	const canRename = isOwner || isEditor;
	const canShare = isOwner || isEditor;
	const canDelete = isOwner;
	const canCopy = type === 'FILE' && !isViewer;

	const displayName = getDisplayName(item);

	const handlePreview = () => {
		if (type === 'FILE') {
			openModal('PREVIEW_FILE', { id: item.id, name: displayName, type, userRole });
		}
	};

	const handleNavigate = () => {
		if (type === 'FOLDER') {
			navigate(`/folder/${item.id}`);
		} else {
			handlePreview();
		}
	};

	const handleRename = () => {
		openModal('RENAME_ITEM', { id: item.id, name: displayName, type, userRole });
	};

	const handleShare = () => {
		openModal('SHARE_ACCESS', { id: item.id, name: displayName, type, userRole });
	};

	const handleDelete = () => {
		openModal('DELETE_ITEM', { id: item.id, name: displayName, type, userRole });
	};

	const handleCopy = async () => {
		if (type !== 'FILE') return;
		try {
			await copyItem(item.type, item.id);
			const parentFolderId = (item as FileItem).folderId;
			await queryClient.invalidateQueries({ queryKey: ['files', parentFolderId] });
			toast.success('File copied successfully');
		} catch (error) {
			console.error(error);
			toast.error('Failed to copy file');
		}
	};

	return {
		permissions: {
			canRename,
			canShare,
			canDelete,
			canCopy,
			isViewer,
			isOwner,
			isEditor,
		},
		actions: {
			handleNavigate,
			handleRename,
			handleShare,
			handleDelete,
			handleCopy,
			handlePreview,
		},
		data: {
			displayName,
			isFolder: type === 'FOLDER',
		},
	};
};
