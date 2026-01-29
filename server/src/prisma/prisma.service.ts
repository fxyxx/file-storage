import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}

	async recordDeletedS3Keys(s3Keys: string[]) {
		if (s3Keys.length === 0) return;
		await this.deletedS3Key.createMany({
			data: s3Keys.map((s3Key) => ({ s3Key })),
		});
	}
}
