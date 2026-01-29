import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { type LoginFormData, loginSchema, useLogin, AuthLayout, AuthErrorAlert, AuthFormFooter } from '@/features/auth';

export const LoginPage = () => {
	const login = useLogin();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (data: LoginFormData) => {
		login.mutate(data);
	};

	return (
		<AuthLayout title="Login" description="Please enter your login details to access your account.">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-4 px-6">
						<AuthErrorAlert error={login.error} defaultMessage="There was an error logging in." />

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											placeholder="your@email.com"
											disabled={login.isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="••••••••"
											disabled={login.isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					<AuthFormFooter
						isPending={login.isPending}
						submitText="Login"
						pendingText="Logging in..."
						linkText="Don't have an account?"
						linkTo="/register"
						linkLabel="Register"
					/>
				</form>
			</Form>
		</AuthLayout>
	);
};
