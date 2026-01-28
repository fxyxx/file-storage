import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email('Enter a valid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export const registerSchema = z
	.object({
		email: z.email('Enter a valid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters long.'),
		confirmPassword: z.string().min(1, 'Confirm password is required.'),
		fullName: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords must match.',
		path: ['confirmPassword'],
	});
