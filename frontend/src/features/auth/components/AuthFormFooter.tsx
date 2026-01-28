import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AuthFormFooterProps {
	isPending: boolean;
	submitText: string;
	pendingText: string;
	linkText: string;
	linkTo: string;
	linkLabel: string;
}

export const AuthFormFooter = ({
	isPending,
	submitText,
	pendingText,
	linkText,
	linkTo,
	linkLabel,
}: AuthFormFooterProps) => {
	return (
		<CardFooter className="flex flex-col gap-3 px-6 pt-4 pb-6">
			<Button type="submit" className="w-full" disabled={isPending}>
				{isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						{pendingText}
					</>
				) : (
					submitText
				)}
			</Button>

			<p className="text-muted-foreground text-center text-sm">
				{linkText}{' '}
				<Link to={linkTo} className="text-primary hover:underline">
					{linkLabel}
				</Link>
			</p>
		</CardFooter>
	);
};
