import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { FindAllCompetitionsDto } from './dto/find-all-competitions.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { PrismaService } from '../prisma/prisma.service';

const include: Prisma.CompetitionInclude = {
  country: true,
  regions: { include: { region: true } },
};

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionDto: CreateCompetitionDto) {
    const { regionsIds, countryId, ...rest } = createCompetitionDto;

    return this.prisma.competition.create({
      data: {
        ...rest,
        country: { connect: { id: countryId } },
        regions: {
          createMany: {
            data: regionsIds.map((regionId) => ({ regionId })),
          },
        },
      },
      include,
    });
  }

  findAll({ countryId, regionId, isJunior, isWomen }: FindAllCompetitionsDto) {
    const where: Prisma.CompetitionWhereInput = {
      countryId,
      regions: {
        some: {
          regionId,
        },
      },
      isJunior,
      isWomen,
    };

    return this.prisma.competition.findMany({ where, include });
  }

  findOne(id: string) {
    return this.prisma.competition.findUnique({ where: { id }, include });
  }

  update(id: number, updateCompetitionDto: UpdateCompetitionDto) {
    return `This action updates a #${id} competition`;
  }

  async remove(id: string) {
    // Delete all region-on-competition entities for the given competition
    await this.prisma.regionsOnCompetitions.deleteMany({
      where: { competitionId: id },
    });
    // Delete an actual competition
    return this.prisma.competition.delete({ where: { id }, include });
  }
}
