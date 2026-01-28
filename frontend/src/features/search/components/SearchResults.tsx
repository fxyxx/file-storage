import { File, Folder } from 'lucide-react';
import type { SearchResult } from '../types';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '@/store/useModalStore';

interface SearchResultsProps {
	results: SearchResult[];
	onClose: () => void;
}

export const SearchResults = ({ results, onClose }: SearchResultsProps) => {
	const navigate = useNavigate();
	const openModal = useModalStore((state) => state.openModal);

	const handleSelect = (item: SearchResult) => {
		if (item.type === 'FOLDER') {
			navigate(`/folder/${item.id}`);
		} else {
			openModal('PREVIEW_FILE', {
				id: item.id,
				name: item.originalName || '',
				type: 'FILE',
			});
		}
		onClose();
	};

	if (results.length === 0) {
		return <div className="p-4 text-center text-sm text-gray-500">Nothing found</div>;
	}

	return (
		<div className="max-h-[400px] overflow-y-auto py-2">
			{results.map((item) => (
				<button
					key={`${item.type}-${item.id}`}
					className="flex w-full items-start gap-3 px-4 py-2 text-left transition-colors hover:bg-gray-100"
					onClick={() => handleSelect(item)}
				>
					<div className="mt-1 shrink-0 text-gray-500">
						{item.type === 'FOLDER' ? <Folder size={18} /> : <File size={18} />}
					</div>
					<div className="min-w-0 flex-1">
						<div className="truncate text-sm font-medium">
							{item.type === 'FOLDER' ? item.name : item.originalName}
						</div>
						<div className="flex items-center gap-1 truncate text-xs text-gray-400">
							{item.path && item.path.length > 0 ? (
								<span>at {item.path.map((p) => p.name).join(' > ')}</span>
							) : (
								<span>at the root</span>
							)}
						</div>
					</div>
				</button>
			))}
		</div>
	);
};
