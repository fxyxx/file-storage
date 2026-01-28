import { type loginSchema, registerSchema } from '../schemas';
import { z } from 'zod';

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	fullName?: string;
}

export interface AuthResponse {
	access_token: string;
}
