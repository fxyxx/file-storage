import type { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AuthLayoutProps {
	title: string;
	description: string;
	children: ReactNode;
}

export const AuthLayout = ({ title, description, children }: AuthLayoutProps) => {
	return (
		<div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<CardHeader className="text-center">
					<CardTitle className="text-xl">{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				{children}
			</Card>
		</div>
	);
};
