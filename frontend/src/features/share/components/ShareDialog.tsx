import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModalStore } from '@/store/useModalStore';
import { useShare } from '../hooks/useShare';
import { ShareInviteForm } from './ShareInviteForm';
import { SharePermissionsList } from './SharePermissionsList';
import type { ShareRole } from '../types/share';

export const ShareDialog = () => {
	const { closeModal } = useModalStore();
	const {
		isVisible,
		isLoading,
		data,
		// Data
		permissions,
		owner,
		currentUserId,

		// Permissions
		isViewer,
		canInvite,
		canManageRoles,
		canRevokeAccess,

		// Actions
		invite,
		revoke,
		changeUserRole,

		// Loading states
		isInviting,
		isRevoking,
		isChangingRole,
	} = useShare();

	if (!isVisible) return null;

	const handleInvite = async (email: string, role: ShareRole) => {
		await invite({ email, role });
	};

	const handleRoleChange = (permissionId: number, currentRole: ShareRole) => {
		const newRole = currentRole === 'VIEWER' ? 'EDITOR' : 'VIEWER';
		changeUserRole({ permissionId, newRole });
	};

	const resourceLabel = data?.type === 'FOLDER' ? 'Folder' : 'File';
	const dialogTitle = isViewer ? `Access: ${resourceLabel}` : `Share ${resourceLabel}`;

	return (
		<Dialog open={isVisible} onOpenChange={(open) => !open && closeModal()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
					<DialogDescription>
						{isViewer ? (
							<>
								View access for <span className="text-foreground font-semibold">"{data?.name}"</span>
							</>
						) : (
							<>
								Share <span className="text-foreground font-semibold">"{data?.name}"</span> with other
								users.
							</>
						)}
					</DialogDescription>
				</DialogHeader>

				{canInvite && <ShareInviteForm onInvite={handleInvite} isPending={isInviting} />}

				<SharePermissionsList
					owner={owner}
					permissions={permissions}
					isLoading={isLoading}
					currentUserId={currentUserId}
					canManageRoles={canManageRoles}
					canRevokeAccess={canRevokeAccess}
					onChangeRole={handleRoleChange}
					onRevoke={revoke}
					isChangingRole={isChangingRole}
					isRevoking={isRevoking}
				/>
			</DialogContent>
		</Dialog>
	);
};
