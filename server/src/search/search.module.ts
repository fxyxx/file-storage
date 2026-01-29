import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SearchRepository } from './search.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [SearchController],
	providers: [SearchService, SearchRepository],
})
export class SearchModule {}
