import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { renameItem } from '@/features/browser';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { DialogFooter } from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Loader2 } from 'lucide-react';

export const RenameForm = ({
	data,
	closeModal,
}: {
	data: { id: number; type: 'FILE' | 'FOLDER'; name: string };
	closeModal: () => void;
}) => {
	const queryClient = useQueryClient();
	const [name, setName] = useState(data.name);
	const [error, setError] = useState('');

	const renameMutation = useMutation({
		mutationFn: () => renameItem(data.type, data.id, name.trim()),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['files'] });
			queryClient.invalidateQueries({ queryKey: ['shared-with-me'] });
			closeModal();
		},
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			setError('Name cannot be empty');
			return;
		}

		renameMutation.mutate();
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="my-4 space-y-2">
				<Label htmlFor="name">Name</Label>
				<Input
					id="name"
					value={name}
					onChange={(e) => {
						setName(e.target.value);
						setError('');
					}}
					placeholder="Enter new name..."
					autoFocus
				/>
				{error && <p className="text-destructive text-sm">{error}</p>}
			</div>

			<DialogFooter>
				<Button type="button" variant="outline" onClick={closeModal} disabled={renameMutation.isPending}>
					Cancel
				</Button>
				<Button type="submit" disabled={renameMutation.isPending || !name.trim()}>
					{renameMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Rename
				</Button>
			</DialogFooter>
		</form>
	);
};
