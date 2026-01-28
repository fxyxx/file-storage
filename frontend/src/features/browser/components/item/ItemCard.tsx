import type { FileSystemItem } from '../../types/item';
import type { UserRole } from '@/types/user';
import { useItemActions } from '../../hooks/useItemActions';
import { ItemIcon } from './ItemIcon';
import { ItemActionsMenu } from './ItemActionsMenu';
import { formatBytes } from '@/lib/utils.ts';

interface ItemCardProps {
	item: FileSystemItem;
	userRole?: UserRole;
}

export const ItemCard = ({ item, userRole = 'OWNER' }: ItemCardProps) => {
	const { permissions, actions, data } = useItemActions({ item, userRole });
	const { handleNavigate, handleRename, handleShare, handleDelete } = actions;
	const { displayName, isFolder } = data;

	const fileSize = item.type === 'FILE' ? formatBytes(item.size) : null;

	return (
		<div
			onClick={handleNavigate}
			className={`group bg-card hover:border-primary/30 hover:bg-accent/50 relative flex flex-col items-center gap-3 rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${isFolder ? 'cursor-pointer' : ''} `}
		>
			<ItemIcon type={item.type} className="h-16 w-16" />

			<div className="w-full text-center">
				<p className="truncate text-sm font-medium" title={displayName}>
					{displayName}
				</p>
				{fileSize && <p className="text-muted-foreground mt-1 text-xs">{fileSize}</p>}
			</div>

			<div className="absolute top-2 right-2">
				<ItemActionsMenu
					permissions={permissions}
					actions={{
						onRename: handleRename,
						onShare: handleShare,
						onDelete: handleDelete,
						onCopy: actions.handleCopy,
						onPreview: actions.handlePreview,
					}}
					triggerClassName="hover:bg-accent rounded-md p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
					isFolder={isFolder}
				/>
			</div>
		</div>
	);
};
