import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup.service';
import { StorageModule } from '../storage';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [StorageModule, PrismaModule],
	providers: [CleanupService],
	exports: [CleanupService],
})
export class CleanupModule {}
