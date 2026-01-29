import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
	type RegisterFormData,
	registerSchema,
	useRegister,
	AuthLayout,
	AuthErrorAlert,
	AuthFormFooter,
} from '@/features/auth';

export const RegisterPage = () => {
	const register = useRegister();

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
			fullName: '',
		},
	});

	const onSubmit = (data: RegisterFormData) => {
		register.mutate({
			email: data.email,
			password: data.password,
			fullName: data.fullName || undefined,
		});
	};

	return (
		<AuthLayout title="Registration" description="Create an account to access the storage">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-4 px-6">
						<AuthErrorAlert error={register.error} defaultMessage="An error occurred while registering" />

						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name (optional)</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="text"
											placeholder="John Doe"
											disabled={register.isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
											disabled={register.isPending}
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
									<FormLabel>Пароль</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="Minimum 6 characters"
											disabled={register.isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm your password</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="Repeat password"
											disabled={register.isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					<AuthFormFooter
						isPending={register.isPending}
						submitText="Register"
						pendingText="Registering..."
						linkText="Already have an account?"
						linkTo="/login"
						linkLabel="Login"
					/>
				</form>
			</Form>
		</AuthLayout>
	);
};
