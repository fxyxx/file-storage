import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { FoldersRepository } from './folders.repository';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FilesModule } from '../files/files.module';

@Module({
	imports: [PermissionsModule, PrismaModule, FilesModule],
	controllers: [FoldersController],
	providers: [FoldersService, FoldersRepository],
})
export class FoldersModule {}
