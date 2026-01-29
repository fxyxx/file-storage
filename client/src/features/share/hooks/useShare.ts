import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPermissions, inviteUser, revokeAccess, changeRole } from '../api/share';
import type { ShareRole } from '../types/share';
import type { ResourceType } from '@/types/resource';
import { useModalStore } from '@/store/useModalStore';

export const useShare = () => {
	const { isOpen, view, data } = useModalStore();
	const queryClient = useQueryClient();

	const isVisible = isOpen && view === 'SHARE_ACCESS';

	const resourceType: ResourceType = data?.type === 'FOLDER' ? 'FOLDER' : 'FILE';
	const resourceId = data?.id;

	const { data: permissionsData, isLoading } = useQuery({
		queryKey: ['permissions', resourceType, resourceId],
		queryFn: () => getPermissions(resourceType, resourceId!),
		enabled: isVisible && !!resourceId,
	});

	const userRole = permissionsData?.userRole || data?.userRole || 'OWNER';
	const permissions = permissionsData?.permissions || [];
	const owner = permissionsData?.owner;
	const currentUserId = permissionsData?.currentUserId;

	const isOwner = userRole === 'OWNER';
	const isEditor = userRole === 'EDITOR';
	const isViewer = userRole === 'VIEWER';

	const canInvite = isOwner || isEditor;
	const canManageRoles = isOwner || isEditor;
	const canRevokeAccess = isOwner || isEditor;

	const inviteMutation = useMutation({
		mutationFn: (vars: { email: string; role: ShareRole }) =>
			inviteUser(resourceType, resourceId!, vars.email, vars.role),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['permissions', resourceType, resourceId],
			});
		},
	});

	const revokeMutation = useMutation({
		mutationFn: (permissionId: number) => revokeAccess(permissionId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['permissions', resourceType, resourceId],
			});
		},
	});

	const changeRoleMutation = useMutation({
		mutationFn: ({ permissionId, newRole }: { permissionId: number; newRole: ShareRole }) =>
			changeRole(permissionId, newRole),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['permissions', resourceType, resourceId],
			});
		},
	});

	return {
		// State
		isVisible,
		isLoading,
		data,
		resourceType,

		// Data
		permissions,
		owner,
		currentUserId,
		userRole,

		// Permissions
		isOwner,
		isEditor,
		isViewer,
		canInvite,
		canManageRoles,
		canRevokeAccess,

		// Actions
		invite: inviteMutation.mutateAsync,
		revoke: revokeMutation.mutateAsync,
		changeUserRole: changeRoleMutation.mutateAsync,

		// Loading states
		isInviting: inviteMutation.isPending,
		isRevoking: revokeMutation.isPending,
		isChangingRole: changeRoleMutation.isPending,
	};
};
