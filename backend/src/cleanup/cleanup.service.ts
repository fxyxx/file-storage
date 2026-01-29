import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { STORAGE_PROVIDER, StorageProvider } from '../storage';

@Injectable()
export class CleanupService {
	private readonly logger = new Logger(CleanupService.name);

	constructor(
		@Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
		private readonly prisma: PrismaService,
	) {}

	@Cron(CronExpression.EVERY_HOUR)
	async cleanupOrphanFiles() {
		this.logger.log('Starting S3 cleanup job...');

		try {
			const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

			const keysToDelete = await this.prisma.deletedS3Key.findMany({
				where: { deletedAt: { lt: oneHourAgo } },
				take: 1000,
			});

			if (keysToDelete.length === 0) {
				this.logger.log('No orphan files to clean up');
				return;
			}

			this.logger.log(`Found ${keysToDelete.length} files to delete from S3`);

			await this.storage.delete(keysToDelete.map((k) => k.s3Key));

			await this.prisma.deletedS3Key.deleteMany({
				where: { id: { in: keysToDelete.map((k) => k.id) } },
			});

			this.logger.log(`Successfully cleaned up ${keysToDelete.length} files`);
		} catch (error) {
			this.logger.error('Error during S3 cleanup:', error);
		}
	}

	async forceCleanup() {
		const keysToDelete = await this.prisma.deletedS3Key.findMany({ take: 1000 });

		if (keysToDelete.length === 0) return { deleted: 0 };

		await this.storage.delete(keysToDelete.map((k) => k.s3Key));
		await this.prisma.deletedS3Key.deleteMany({
			where: { id: { in: keysToDelete.map((k) => k.id) } },
		});

		return { deleted: keysToDelete.length };
	}
}
