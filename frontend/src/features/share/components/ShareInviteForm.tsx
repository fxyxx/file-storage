import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus } from 'lucide-react';
import type { ShareRole } from '../types/share';

const inviteSchema = z.object({
	email: z.email('Invalid email format').min(1, 'Email is required'),
	role: z.enum(['VIEWER', 'EDITOR'] as const),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface ShareInviteFormProps {
	onInvite: (email: string, role: ShareRole) => Promise<void>;
	isPending: boolean;
}

export const ShareInviteForm = ({ onInvite, isPending }: ShareInviteFormProps) => {
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm<InviteFormData>({
		resolver: zodResolver(inviteSchema),
		defaultValues: {
			email: '',
			role: 'VIEWER',
		},
	});

	const onSubmit = async (data: InviteFormData) => {
		try {
			await onInvite(data.email, data.role);
			reset({ email: '', role: 'VIEWER' });
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to invite user';
			setError('root', {
				message,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="flex items-start gap-2">
				<div className="flex-1 space-y-1">
					<Label htmlFor="email" className="sr-only">
						Email
					</Label>
					<Input
						id="email"
						placeholder="Enter email to invite..."
						className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
						{...register('email')}
					/>
					{errors.email && <p className="text-destructive ml-1 text-xs">{errors.email.message}</p>}
				</div>

				<div className="space-y-1">
					<select
						className="bg-background focus:ring-ring h-9 rounded-md border px-3 text-sm focus:ring-1 focus:outline-none"
						{...register('role')}
					>
						<option value="VIEWER">Viewer</option>
						<option value="EDITOR">Editor</option>
					</select>
				</div>

				<Button type="submit" size="sm" disabled={isPending} className="px-3">
					{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
				</Button>
			</div>

			{errors.root && <p className="text-destructive text-sm">{errors.root.message}</p>}
		</form>
	);
};
