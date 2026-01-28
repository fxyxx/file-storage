import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export const HomePage = () => {
	return (
		<div className="flex h-screen w-full flex-col">
			<Header />
			<main className="flex-1 overflow-hidden p-4">
				<Outlet />
			</main>
		</div>
	);
};
