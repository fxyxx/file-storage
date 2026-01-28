import { MoreVertical, Pencil, Share2, Trash2, Copy, Eye } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ItemActionsMenuProps {
	permissions: {
		canRename: boolean;
		canShare: boolean;
		canDelete: boolean;
		canCopy?: boolean;
		isViewer: boolean;
		canPreview?: boolean;
	};
	actions: {
		onRename: () => void;
		onShare: () => void;
		onDelete: () => void;
		onCopy?: () => void;
		onPreview: () => void;
	};
	triggerClassName?: string;
	isFolder?: boolean;
}

export const ItemActionsMenu = ({ permissions, actions, triggerClassName, isFolder }: ItemActionsMenuProps) => {
	const { canRename, canShare, canDelete, canCopy, isViewer } = permissions;
	const { onRename, onShare, onDelete, onCopy, onPreview } = actions;

	const menuItems = [
		{
			label: 'Preview',
			icon: Eye,
			onClick: onPreview,
			show: !isFolder,
		},
		{
			label: 'Rename',
			icon: Pencil,
			onClick: onRename,
			show: canRename,
		},
		{
			label: 'Copy',
			icon: Copy,
			onClick: onCopy,
			show: !!canCopy && !!onCopy,
		},
		{
			label: 'Share',
			icon: Share2,
			onClick: onShare,
			show: canShare,
		},
		{
			label: 'View Access',
			icon: Share2,
			onClick: onShare,
			show: isViewer,
		},
		{
			label: 'Delete',
			icon: Trash2,
			onClick: onDelete,
			show: canDelete,
			variant: 'destructive' as const,
			separator: true,
		},
	].filter((item) => item.show);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					onClick={(e) => e.stopPropagation()}
					className={triggerClassName || 'hover:bg-accent rounded-md p-1.5 transition-colors'}
				>
					<MoreVertical className="text-muted-foreground h-4 w-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
				{menuItems.map((item) => {
					const Icon = item.icon;
					return (
						<div key={item.label}>
							{item.separator && <DropdownMenuSeparator />}
							<DropdownMenuItem
								onClick={item.onClick}
								className={
									item.variant === 'destructive'
										? 'text-red-600 focus:bg-red-50 focus:text-red-600'
										: ''
								}
							>
								<Icon
									className={`mr-2 h-4 w-4 ${item.variant === 'destructive' ? 'text-red-600' : ''}`}
								/>
								{item.label}
							</DropdownMenuItem>
						</div>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
