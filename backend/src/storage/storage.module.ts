import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3StorageService } from './s3-storage.service';

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: STORAGE_PROVIDER,
			useClass: S3StorageService,
		},
	],
	exports: [STORAGE_PROVIDER],
})
export class StorageModule {}
