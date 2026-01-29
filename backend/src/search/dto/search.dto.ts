import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchQueryDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	q: string;
}

export class PathItemDto {
	id: number;
	name: string;
}

export class SearchResultDto {
	id: number;
	name: string;
	type: 'FILE' | 'FOLDER';
	path: PathItemDto[];
}
