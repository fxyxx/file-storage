export interface User {
	id: number;
	email: string;
}

export type UserRole = 'OWNER' | 'EDITOR' | 'VIEWER';
