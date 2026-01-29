import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { HydrationLoader } from './HydrationLoader';
import type { ReactNode } from 'react';

interface GuestRouteProps {
	children: ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
	const token = useAuthStore((state) => state.token);
	const hasHydrated = useAuthStore((state) => state._hasHydrated);

	if (!hasHydrated) {
		return <HydrationLoader />;
	}

	return token ? <Navigate to="/" replace /> : children;
};
