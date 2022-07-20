import { IsEnum, IsInt, IsOptional } from 'class-validator';

import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';

export class CreateUserPlayerAceDto {
  @IsInt()
  userId: number;

  @IsInt()
  playerId: number;

  @IsOptional()
  @IsEnum(AccessControlEntryPermissionLevelEnum, {
    message: `Permission level must be a valid enum value. Available values: ${Object.keys(
      AccessControlEntryPermissionLevelEnum,
    ).join(', ')}`,
  })
  permissionLevel?: AccessControlEntryPermissionLevelEnum;
}
