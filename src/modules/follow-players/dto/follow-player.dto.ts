import { Expose, plainToInstance, Transform } from 'class-transformer';

import { PlayerBasicDataWithoutTeamsDto } from '../../players/dto/player.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class FollowPlayerDto {
  @Transform(({ value }) =>
    plainToInstance(PlayerBasicDataWithoutTeamsDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerBasicDataWithoutTeamsDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  follower: UserBasicDataDto;
}
