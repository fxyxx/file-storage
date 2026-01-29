import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth-storage');

	if (token) {
		const parsed = JSON.parse(token);
		const jwt = parsed.state?.token;

		if (jwt) {
			config.headers.Authorization = `Bearer ${jwt}`;
		}
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			const authStorage = localStorage.getItem('auth-storage');
			const hasToken = authStorage && JSON.parse(authStorage).state?.token;

			const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

			if (hasToken && !isAuthPage) {
				localStorage.removeItem('auth-storage');
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	},
);
