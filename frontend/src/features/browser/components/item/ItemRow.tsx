import type { FileSystemItem } from '../../types/item';
import type { UserRole } from '@/types/user';
import { useItemActions } from '../../hooks/useItemActions';
import { ItemIcon } from './ItemIcon';
import { ItemActionsMenu } from './ItemActionsMenu';
import { formatBytes, formatDate } from '@/lib/utils.ts';

interface ItemListRowProps {
	item: FileSystemItem;
	userRole?: UserRole;
}

export const ItemRow = ({ item, userRole = 'OWNER' }: ItemListRowProps) => {
	const { permissions, actions, data } = useItemActions({ item, userRole });
	const { handleNavigate, handleRename, handleShare, handleDelete } = actions;
	const { displayName, isFolder } = data;

	const fileSize = item.type === 'FILE' ? formatBytes(item.size) : '—';
	const dateStr = formatDate(item.createdAt);

	return (
		<div
			onClick={handleNavigate}
			className={`group bg-card hover:border-primary/30 hover:bg-accent/50 flex items-center gap-4 rounded-lg border px-4 py-3 transition-all duration-200 ${isFolder ? 'cursor-pointer' : ''} `}
		>
			<ItemIcon type={item.type} className="h-10 w-10 shrink-0" />

			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium" title={displayName}>
					{displayName}
				</p>
			</div>

			<div className="text-muted-foreground hidden w-24 shrink-0 text-right text-sm sm:block">{fileSize}</div>
			<div className="text-muted-foreground hidden w-32 shrink-0 text-right text-sm md:block">{dateStr}</div>

			<div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
				<ItemActionsMenu
					permissions={permissions}
					actions={{
						onRename: handleRename,
						onShare: handleShare,
						onDelete: handleDelete,
						onCopy: actions.handleCopy,
						onPreview: actions.handlePreview,
					}}
					isFolder={isFolder}
				/>
			</div>
		</div>
	);
};
