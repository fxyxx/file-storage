import { AxiosError } from 'axios';

interface AuthErrorAlertProps {
	error: Error | null;
	defaultMessage?: string;
}

const getErrorMessage = (error: AxiosError<{ message: string | string[] }>, defaultMessage: string) => {
	const message = error.response?.data?.message;
	if (Array.isArray(message)) return message.join(', ');
	return message || defaultMessage;
};

export const AuthErrorAlert = ({ error, defaultMessage = 'An error occurred' }: AuthErrorAlertProps) => {
	if (!error) return null;

	return (
		<div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
			{getErrorMessage(error as AxiosError<{ message: string | string[] }>, defaultMessage)}
		</div>
	);
};
