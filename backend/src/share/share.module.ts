import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { ShareRepository } from './share.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
	imports: [PrismaModule, PermissionsModule],
	controllers: [ShareController],
	providers: [ShareService, ShareRepository],
	exports: [ShareService],
})
export class ShareModule {}
