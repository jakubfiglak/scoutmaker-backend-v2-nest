import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Patch(':id/add-member')
  addMember(
    @Param('id') id: string,
    @Body() toggleMembershipDto: ToggleMembershipDto,
  ) {
    return this.organizationsService.addMember(id, toggleMembershipDto);
  }

  @Patch(':id/remove-member')
  removeMember(
    @Param('id') id: string,
    @Body() toggleMembershipDto: ToggleMembershipDto,
  ) {
    return this.organizationsService.removeMember(id, toggleMembershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
