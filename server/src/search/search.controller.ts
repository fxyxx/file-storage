import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchQueryDto, SearchResultDto } from './dto/search.dto';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get()
	async search(@Request() req: { user: { id: number } }, @Query() query: SearchQueryDto): Promise<SearchResultDto[]> {
		return this.searchService.search(req.user.id, query.q);
	}
}
