import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getFolder } from '../../api/folders';
import { Skeleton } from '@/components/ui/skeleton';
import type { FolderItem } from '../../types/item';

interface BreadcrumbsProps {
	folderId: number | null;
}

export const Breadcrumbs = ({ folderId }: BreadcrumbsProps) => {
	const { data, isLoading } = useQuery({
		queryKey: ['folder', folderId],
		queryFn: () => getFolder(folderId!),
		enabled: !!folderId,
	});

	if (!folderId) {
		return (
			<div className="flex items-center text-lg font-semibold">
				<Home className="mr-2 h-5 w-5" />
				My files
			</div>
		);
	}

	if (isLoading) {
		return <Skeleton className="h-7 w-48" />;
	}

	if (!data) return null;

	return (
		<div className="text-muted-foreground flex flex-wrap items-center gap-1 text-lg font-medium">
			<Link to="/" className="hover:text-foreground flex items-center transition-colors" title="На главную">
				<Home className="h-5 w-5" />
			</Link>

			{data.path.map((folder: FolderItem) => (
				<div key={folder.id} className="flex items-center gap-1">
					<ChevronRight className="text-muted-foreground/40 h-5 w-5" />
					<Link to={`/folder/${folder.id}`} className="hover:text-foreground transition-colors">
						{folder.name}
					</Link>
				</div>
			))}

			<div className="flex items-center gap-1">
				<ChevronRight className="text-muted-foreground/40 h-5 w-5" />
				<span className="text-foreground font-semibold">{data.name}</span>
			</div>
		</div>
	);
};
