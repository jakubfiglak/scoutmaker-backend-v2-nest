import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class FindAllCountriesDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isEuMember?: boolean;
}
