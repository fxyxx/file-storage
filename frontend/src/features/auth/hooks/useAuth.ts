import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import type { LoginRequest, RegisterRequest } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { AxiosError } from 'axios';

interface ApiError {
	message: string | string[];
	error?: string;
	statusCode?: number;
}

function parseJwt(token: string): { sub: number; email: string } | null {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join(''),
		);
		return JSON.parse(jsonPayload);
	} catch {
		return null;
	}
}

export function useLogin() {
	const navigate = useNavigate();
	const setAuth = useAuthStore((state) => state.setAuth);

	return useMutation({
		mutationFn: (data: LoginRequest) => login(data),
		onSuccess: (response) => {
			const payload = parseJwt(response.access_token);
			if (payload) {
				setAuth(response.access_token, {
					id: payload.sub,
					email: payload.email,
				});
			}
			navigate('/');
		},
		onError: (error: AxiosError<ApiError>) => {
			console.error('Login error:', error.response?.data?.message);
		},
	});
}

export function useRegister() {
	const navigate = useNavigate();
	const setAuth = useAuthStore((state) => state.setAuth);

	return useMutation({
		mutationFn: (data: RegisterRequest) => register(data),
		onSuccess: (response) => {
			const payload = parseJwt(response.access_token);
			if (payload) {
				setAuth(response.access_token, {
					id: payload.sub,
					email: payload.email,
				});
			}
			navigate('/');
		},
		onError: (error: AxiosError<ApiError>) => {
			console.error('Register error:', error.response?.data?.message);
		},
	});
}

export function useLogout() {
	const navigate = useNavigate();
	const logout = useAuthStore((state) => state.logout);

	return () => {
		logout();
		navigate('/login');
	};
}
