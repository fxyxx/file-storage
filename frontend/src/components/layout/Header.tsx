import { SearchInput } from '@/features/search';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth';

export const Header = () => {
	const logout = useAuthStore((state) => state.logout);

	return (
		<header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-6">
			<div className="flex w-full items-center gap-8">
				<div className="flex w-full items-center gap-4">
					<Link to="/" className="shrink-0 text-xl font-bold">
						FileDrive
					</Link>

					<div className="max-w-2xl flex-1">
						<SearchInput />
					</div>
				</div>

				<Button variant="ghost" size="icon" onClick={logout}>
					<LogOut className="h-5 w-5" />
				</Button>
			</div>
		</header>
	);
};
