import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FilesRepository } from './files.repository';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage';

@Module({
	imports: [StorageModule, PermissionsModule, PrismaModule],
	controllers: [FilesController],
	providers: [FilesService, FilesRepository],
	exports: [FilesService, FilesRepository],
})
export class FilesModule {}
