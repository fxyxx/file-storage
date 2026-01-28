import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { Permission } from '../types/permission';
import type { ShareRole } from '../types/share';

interface SharePermissionItemProps {
	permission: Permission;
	currentUserId?: number;
	canManageRoles: boolean;
	canRevokeAccess: boolean;
	onChangeRole: (permissionId: number, currentRole: ShareRole) => void;
	onRevoke: (permissionId: number) => void;
	isChangingRole: boolean;
	isRevoking: boolean;
}

export const SharePermissionItem = ({
	permission,
	currentUserId,
	canManageRoles,
	canRevokeAccess,
	onChangeRole,
	onRevoke,
	isChangingRole,
	isRevoking,
}: SharePermissionItemProps) => {
	return (
		<div className="bg-accent/50 flex items-center justify-between rounded-md px-3 py-2">
			<div className="flex flex-col">
				<span className="text-sm font-medium">
					{permission.user.email}
					{permission.userId === currentUserId && (
						<span className="text-muted-foreground ml-1 text-xs">(you)</span>
					)}
				</span>
				<span className="text-muted-foreground text-xs">{permission.role}</span>
			</div>

			{permission.inherited ? (
				<span className="text-muted-foreground text-xs italic">Inherited</span>
			) : canManageRoles ? (
				<div className="flex gap-1">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onChangeRole(permission.id, permission.role)}
						disabled={isChangingRole}
					>
						{permission.role === 'VIEWER' ? 'Make Editor' : 'Make Viewer'}
					</Button>
					{canRevokeAccess && (
						<Button
							variant="ghost"
							size="icon"
							className="text-destructive hover:text-destructive"
							onClick={() => onRevoke(permission.id)}
							disabled={isRevoking}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					)}
				</div>
			) : (
				<span className="text-muted-foreground text-xs capitalize">{permission.role.toLowerCase()}</span>
			)}
		</div>
	);
};
