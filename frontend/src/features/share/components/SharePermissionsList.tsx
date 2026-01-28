import { Label } from '@/components/ui/label';
import { Crown, Loader2 } from 'lucide-react';
import type { Permission } from '../types/permission';
import type { ShareRole } from '../types/share';
import { SharePermissionItem } from './SharePermissionItem';

interface SharePermissionsListProps {
	owner?: { id: number; email: string } | null;
	permissions: Permission[];
	isLoading: boolean;
	currentUserId?: number;
	canManageRoles: boolean;
	canRevokeAccess: boolean;
	onChangeRole: (permissionId: number, currentRole: ShareRole) => void;
	onRevoke: (permissionId: number) => void;
	isChangingRole: boolean;
	isRevoking: boolean;
}

export const SharePermissionsList = ({
	owner,
	permissions,
	isLoading,
	currentUserId,
	canManageRoles,
	canRevokeAccess,
	onChangeRole,
	onRevoke,
	isChangingRole,
	isRevoking,
}: SharePermissionsListProps) => {
	return (
		<div className="mt-4 space-y-2">
			<Label>People with access</Label>
			<div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-2">
				{isLoading ? (
					<div className="flex items-center justify-center py-4">
						<Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
					</div>
				) : (
					<>
						{owner && (
							<div className="bg-primary/10 flex items-center justify-between rounded-md px-3 py-2">
								<div className="flex flex-col">
									<div className="flex items-center gap-2">
										<Crown className="h-4 w-4 text-amber-500" />
										<span className="text-sm font-medium">
											{owner.email}
											{owner.id === currentUserId && (
												<span className="text-muted-foreground ml-1 text-xs">(you)</span>
											)}
										</span>
									</div>
									<span className="text-muted-foreground ml-6 text-xs">Owner</span>
								</div>
							</div>
						)}

						{permissions.map((perm) => (
							<SharePermissionItem
								key={perm.id}
								permission={perm}
								currentUserId={currentUserId}
								canManageRoles={canManageRoles}
								canRevokeAccess={canRevokeAccess}
								onChangeRole={onChangeRole}
								onRevoke={onRevoke}
								isChangingRole={isChangingRole}
								isRevoking={isRevoking}
							/>
						))}

						{!owner && permissions.length === 0 && (
							<p className="text-muted-foreground py-4 text-center text-sm">No one has access yet</p>
						)}
					</>
				)}
			</div>
		</div>
	);
};
