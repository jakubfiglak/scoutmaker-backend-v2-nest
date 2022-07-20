import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

import { mapStringToNumber } from '../../../utils/helpers';

export class FindAllUserSubscriptionsDto {
  @IsOptional()
  @IsString()
  userId?: number;

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  competitionIds?: number[];

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  competitionGroupIds?: number[];
}
