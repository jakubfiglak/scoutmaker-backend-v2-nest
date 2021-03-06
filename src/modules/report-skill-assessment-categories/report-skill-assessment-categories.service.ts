import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateReportSkillAssessmentCategoryDto } from './dto/create-report-skill-assessment-category.dto';
import { UpdateReportSkillAssessmentCategoryDto } from './dto/update-report-skill-assessment-category.dto';

@Injectable()
export class ReportSkillAssessmentCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createReportSkillAssessmentCategoryDto: CreateReportSkillAssessmentCategoryDto,
    authorId: number,
  ) {
    return this.prisma.reportSkillAssessmentCategory.create({
      data: {
        ...createReportSkillAssessmentCategoryDto,
        author: { connect: { id: authorId } },
      },
    });
  }

  findAll() {
    return this.prisma.reportSkillAssessmentCategory.findMany();
  }

  findOne(id: number) {
    return this.prisma.reportSkillAssessmentCategory.findUnique({
      where: { id },
    });
  }

  update(
    id: number,
    updateReportSkillAssessmentCategoryDto: UpdateReportSkillAssessmentCategoryDto,
  ) {
    return this.prisma.reportSkillAssessmentCategory.update({
      where: { id },
      data: updateReportSkillAssessmentCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.reportSkillAssessmentCategory.delete({
      where: { id },
    });
  }
}
