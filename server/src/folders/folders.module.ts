import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { FoldersRepository } from './folders.repository';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FilesModule } from '../files/files.module';
import { StorageModule } from '../storage/storage.module';

@Module({
	imports: [PermissionsModule, PrismaModule, FilesModule, StorageModule],
	controllers: [FoldersController],
	providers: [FoldersService, FoldersRepository],
})
export class FoldersModule {}
