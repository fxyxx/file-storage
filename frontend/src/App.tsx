import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { FloatingUploader } from '@/features/upload';
import { ModalManager } from '@/features/browser';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<FloatingUploader />
			<ModalManager />
		</QueryClientProvider>
	);
}

export default App;
