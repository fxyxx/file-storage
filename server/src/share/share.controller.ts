import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResourceType } from '@prisma/client';

import { ShareService } from './share.service';
import { InviteUserDto, ChangeRoleDto } from './dto/share.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';

@ApiTags('Sharing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('share')
export class ShareController {
	constructor(private readonly shareService: ShareService) {}

	@ApiOperation({ summary: 'Get files and folders available to me' })
	@Get('shared-with-me')
	getSharedWithMe(@User('id') userId: number) {
		return this.shareService.getSharedWithMe(userId);
	}

	@ApiOperation({ summary: 'Get a list of access rights for a specific resource' })
	@Get(':resourceType/:resourceId')
	getPermissions(
		@User('id') userId: number,
		@Param('resourceType') resourceType: ResourceType,
		@Param('resourceId', ParseIntPipe) resourceId: number,
	) {
		return this.shareService.getResourcePermissions(userId, resourceType, resourceId);
	}

	@ApiOperation({ summary: 'Grant access to a user (Invite)' })
	@Post('invite')
	inviteUser(@User('id') userId: number, @Body() dto: InviteUserDto) {
		return this.shareService.inviteUser(userId, dto);
	}

	@ApiOperation({ summary: 'Change the role of an existing access' })
	@Patch(':permissionId')
	changeRole(
		@User('id') userId: number,
		@Param('permissionId', ParseIntPipe) permissionId: number,
		@Body() dto: ChangeRoleDto,
	) {
		return this.shareService.changeRole(userId, permissionId, dto.role);
	}

	@ApiOperation({ summary: 'Revoke access' })
	@Delete(':permissionId')
	revokeAccess(@User('id') userId: number, @Param('permissionId', ParseIntPipe) permissionId: number) {
		return this.shareService.revokeAccess(userId, permissionId);
	}
}
