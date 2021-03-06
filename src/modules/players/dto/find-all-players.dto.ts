import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { mapStringToNumber } from '../../../utils/helpers';
import { FootEnum } from '../types';

export class FindAllPlayersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1950)
  @Max(2050)
  bornAfter?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1950)
  @Max(2050)
  bornBefore?: number;

  @IsOptional()
  @IsEnum(FootEnum, {
    message: `Footed must be a valid enum value. Available values: ${Object.keys(
      FootEnum,
    ).join(', ')}`,
  })
  footed?: FootEnum;

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  countryIds?: number[];

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  positionIds?: number[];

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  teamIds?: number[];

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

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isLiked?: boolean;
}
