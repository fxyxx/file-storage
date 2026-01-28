import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export const RouteError = () => {
	const error = useRouteError();
	const navigate = useNavigate();

	let errorMessage: string;

	if (isRouteErrorResponse(error)) {
		errorMessage = error.statusText || error.data?.message || 'Unknown error';
	} else if (error instanceof Error) {
		errorMessage = error.message;
	} else if (typeof error === 'string') {
		errorMessage = error;
	} else {
		console.error(error);
		errorMessage = 'Unknown error';
	}

	return (
		<div className="bg-background text-foreground flex h-screen w-full flex-col items-center justify-center gap-4 p-4">
			<div className="flex flex-col items-center gap-2 text-center">
				<AlertCircle className="text-destructive h-12 w-12" />
				<h1 className="text-4xl font-bold">Oops!</h1>
				<p className="text-muted-foreground text-xl">Sorry, an unexpected error has occurred.</p>
				<p className="bg-muted mt-2 max-w-md rounded p-2 font-mono text-sm break-words">{errorMessage}</p>
			</div>
			<div className="flex gap-2">
				<Button onClick={() => navigate(-1)} variant="outline">
					Go Back
				</Button>
				<Button onClick={() => navigate('/')}>Go Home</Button>
				<Button onClick={() => window.location.reload()} variant="secondary">
					Reload Page
				</Button>
			</div>
		</div>
	);
};
