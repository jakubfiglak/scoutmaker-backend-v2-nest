import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationReportAccessControlEntry } from '@prisma/client';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { OrganizationReportAclService } from '../../organization-report-acl/organization-report-acl.service';
import { UserReportAclService } from '../../user-report-acl/user-report-acl.service';
import { ReportsService } from '../reports.service';

@Injectable()
export class UpdateGuard implements CanActivate {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly userAclService: UserReportAclService,
    private readonly organizationAclService: OrganizationReportAclService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    // If user is an admin, they can update all reports
    if (user.role === 'ADMIN') {
      return true;
    }

    // If user is not an admin, we have to fetch the report to determine if they can update it
    const note = await this.reportsService.findOne(request.params.id);

    // If user is a playmaker-scout, they can update all reports created by other playmaker-scouts
    if (
      user.role === 'PLAYMAKER_SCOUT' &&
      note.author.role === 'PLAYMAKER_SCOUT'
    ) {
      return true;
    }

    // Users can update their own reports
    if (user.id === note.author.id) {
      return true;
    }

    // Users can update reports if they have ACE for this note with UPDATE permission
    const userAce = await this.userAclService.findOneByUserAndReportId(
      user.id,
      note.id,
    );

    if (
      userAce?.permissionLevel === 'READ_AND_WRITE' ||
      userAce?.permissionLevel === 'FULL'
    ) {
      return true;
    }

    // User can update reports if their organization has ACE for this note
    let organizationAce: OrganizationReportAccessControlEntry = null;

    if (user.organizationId) {
      organizationAce =
        await this.organizationAclService.findOneByOrganizationAndReportId(
          user.organizationId,
          note.id,
        );
    }

    if (
      organizationAce?.permissionLevel === 'READ_AND_WRITE' ||
      organizationAce?.permissionLevel === 'FULL'
    ) {
      return true;
    }

    const lang = request.acceptsLanguages()[0];

    const message = this.i18n.translate('reports.UPDATE_ACCESS_ERROR', {
      lang,
      args: { docNumber: note.docNumber },
    });

    throw new UnauthorizedException(message);
  }
}
