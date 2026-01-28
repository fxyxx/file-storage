import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { HydrationLoader } from './HydrationLoader';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
	children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const token = useAuthStore((state) => state.token);
	const hasHydrated = useAuthStore((state) => state._hasHydrated);

	if (!hasHydrated) {
		return <HydrationLoader />;
	}

	return token ? children : <Navigate to="/login" replace />;
};
