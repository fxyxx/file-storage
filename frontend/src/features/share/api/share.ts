import { api } from '@/api/axios';
import type { SharedWithMeResponse, ShareRole } from '../types/share';
import type { Permission, PermissionsResponse } from '../types/permission';
import type { ResourceType } from '@/types/resource';

export const getPermissions = async (resourceType: ResourceType, resourceId: number): Promise<PermissionsResponse> => {
	const { data } = await api.get<PermissionsResponse>(`/share/${resourceType}/${resourceId}`);
	return data;
};

export const inviteUser = async (
	resourceType: ResourceType,
	resourceId: number,
	email: string,
	role: ShareRole,
): Promise<Permission> => {
	const { data } = await api.post<Permission>('/share/invite', {
		resourceType,
		resourceId,
		email,
		role,
	});
	return data;
};

export const revokeAccess = async (permissionId: number): Promise<void> => {
	await api.delete(`/share/${permissionId}`);
};

export const changeRole = async (permissionId: number, role: ShareRole): Promise<Permission> => {
	const { data } = await api.patch<Permission>(`/share/${permissionId}`, {
		role,
	});
	return data;
};

export const getSharedWithMe = async (): Promise<SharedWithMeResponse> => {
	const { data } = await api.get<SharedWithMeResponse>('/share/shared-with-me');
	return data;
};
