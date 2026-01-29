import type { ShareRole } from './share';
import type { UserRole } from '@/types/user';
import type { ResourceType } from '@/types/resource';

export interface Permission {
	id: number;
	resourceType: ResourceType;
	resourceId: number;
	userId: number;
	role: ShareRole;
	createdAt: string;
	user: {
		id: number;
		email: string;
		fullName: string | null;
	};
	inherited?: boolean;
}

export interface PermissionsResponse {
	permissions: Permission[];
	userRole: UserRole;
	owner: {
		id: number;
		email: string;
		fullName: string | null;
	} | null;
	currentUserId: number;
}
