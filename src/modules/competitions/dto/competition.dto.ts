import { CompetitionJuniorLevel, Gender } from '@prisma/client';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { CompetitionAgeCategoryDto } from '../../competition-age-categories/dto/competition-age-category.dto';
import { CompetitionJuniorLevelDto } from '../../competition-junior-levels/dto/competition-junior-level.dto';
import { CompetitionTypeDto } from '../../competition-types/dto/competition-type.dto';
import { CountryDto } from '../../countries/dto/country.dto';

export class CompetitionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  level: number;

  @Expose()
  gender: Gender;

  @Transform(({ value }) =>
    plainToInstance(CountryDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  country: CountryDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionAgeCategoryDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  ageCategory: CompetitionAgeCategoryDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionAgeCategoryDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  type: CompetitionTypeDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionJuniorLevelDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  juniorLevel?: CompetitionJuniorLevel;
}
