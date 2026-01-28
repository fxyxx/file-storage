import type { RouteObject } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage.tsx';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { FileBrowser } from '@/features/browser';
import { ProtectedRoute, GuestRoute } from '@/features/auth';
import { RouteError } from '@/components/RouteError';

export const authRoutes: RouteObject[] = [
	{
		path: '/login',
		element: (
			<GuestRoute>
				<LoginPage />
			</GuestRoute>
		),
		errorElement: <RouteError />,
	},
	{
		path: '/register',
		element: (
			<GuestRoute>
				<RegisterPage />
			</GuestRoute>
		),
		errorElement: <RouteError />,
	},
];

export const dashboardRoutes: RouteObject[] = [
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<HomePage />
			</ProtectedRoute>
		),
		errorElement: <RouteError />,
		children: [
			{
				index: true,
				element: <FileBrowser />,
			},
			{
				path: 'folder/:folderId',
				element: <FileBrowser />,
			},
		],
	},
];

export const routes: RouteObject[] = [...dashboardRoutes, ...authRoutes];
