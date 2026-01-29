import type { SearchResult } from '../types';
import { SearchResults } from './SearchResults';

export const SearchResultList = ({
	results,
	onClose,
	isFetching,
}: {
	results: SearchResult[];
	onClose: () => void;
	isFetching: boolean;
}) => {
	return (
		<div className={isFetching ? 'opacity-50 transition-opacity' : ''}>
			<SearchResults results={results || []} onClose={onClose} />
		</div>
	);
};
