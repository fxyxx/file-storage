import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchResources } from '../api/search';
import { SearchResultList } from './SearchResultList';

export const SearchInput = () => {
	const [query, setQuery] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const [debouncedQuery, setDebouncedQuery] = useState(query);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
			if (query.length > 0) setIsOpen(true);
			else setIsOpen(false);
		}, 300);

		return () => clearTimeout(timer);
	}, [query]);

	const {
		data: results,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ['search', debouncedQuery],
		queryFn: () => searchResources(debouncedQuery),
		enabled: debouncedQuery.length > 0,
		staleTime: 1000 * 60,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleClear = () => {
		setQuery('');
		setIsOpen(false);
	};

	return (
		<div className="relative w-full max-w-2xl" ref={containerRef}>
			<div className="relative">
				<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Поиск файлов и папок..."
					className="focus:ring-primary h-10 w-full rounded-lg border-none bg-gray-100 pr-10 pl-10 text-sm transition-all outline-none focus:bg-white focus:ring-2"
					onFocus={() => {
						if (debouncedQuery.length > 0) setIsOpen(true);
					}}
				/>
				{isFetching ? (
					<Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
				) : query ? (
					<button
						onClick={handleClear}
						className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
					>
						<X className="h-4 w-4" />
					</button>
				) : null}
			</div>

			{isOpen && (results || isLoading) && (
				<div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
					{!results && isLoading ? (
						<div className="p-4 text-center text-sm text-gray-500">Поиск...</div>
					) : (
						<SearchResultList
							results={results || []}
							onClose={() => setIsOpen(false)}
							isFetching={isFetching}
						/>
					)}
				</div>
			)}
		</div>
	);
};
