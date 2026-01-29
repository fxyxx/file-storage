import { Folder, File } from 'lucide-react';
import type { ResourceType } from '@/types/resource';

interface ItemIconProps {
	type: ResourceType;
	className?: string;
}

export const ItemIcon = ({ type, className }: ItemIconProps) => {
	const containerBaseClass = 'flex items-center justify-center rounded-lg';
	const colorClass = type === 'FOLDER' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500';

	return (
		<div className={`${containerBaseClass} ${colorClass} ${className}`}>
			{type === 'FOLDER' ? (
				<Folder className="h-1/2 w-1/2" fill="currentColor" />
			) : (
				<File className="h-1/2 w-1/2" />
			)}
		</div>
	);
};
