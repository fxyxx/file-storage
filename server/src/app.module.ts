import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { FoldersModule } from './folders/folders.module';
import { ShareModule } from './share/share.module';
import { SearchModule } from './search/search.module';
import { CleanupModule } from './cleanup/cleanup.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		ScheduleModule.forRoot(),
		PrismaModule,
		AuthModule,
		FilesModule,
		FoldersModule,
		ShareModule,
		SearchModule,
		CleanupModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
