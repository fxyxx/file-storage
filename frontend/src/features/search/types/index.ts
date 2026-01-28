export interface SearchResult {
	id: number;
	name?: string;
	originalName?: string;
	type: 'FILE' | 'FOLDER';
	mimetype?: string;
	path: Array<{ id: number; name: string }>;
}

export interface SearchResponse {
	results: SearchResult[];
}
