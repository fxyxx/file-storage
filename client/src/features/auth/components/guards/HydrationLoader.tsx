import { Loader2 } from 'lucide-react';

export const HydrationLoader = () => (
	<div className="flex min-h-screen items-center justify-center">
		<Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
	</div>
);
