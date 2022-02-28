import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../../api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllTeamsDto } from './dto/find-all-teams.dto';
import { TeamDto } from './dto/team.dto';
import { TeamsPaginationOptionsDto } from './dto/teams-pagination-options.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
@ApiTags('teams')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiResponse(TeamDto, { type: 'create' })
  @Serialize(TeamDto)
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const team = await this.teamsService.create(createTeamDto, user.id);
    return formatSuccessResponse('Successfully created new team', team);
  }

  @Get()
  @ApiPaginatedResponse(TeamDto)
  @ApiQuery({ type: TeamsPaginationOptionsDto })
  @Serialize(TeamDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: TeamsPaginationOptionsDto,
    @Query() query: FindAllTeamsDto,
  ) {
    const data = await this.teamsService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all teams', data);
  }

  @Get(':id')
  @ApiResponse(TeamDto, { type: 'read' })
  @Serialize(TeamDto)
  async findOne(@Param('id') id: string) {
    const team = await this.teamsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched team with the id of ${id}`,
      team,
    );
  }

  @Patch(':id')
  @ApiResponse(TeamDto, { type: 'update' })
  @Serialize(TeamDto)
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    const team = await this.teamsService.update(id, updateTeamDto);
    return formatSuccessResponse(
      `Successfully updated team with the id of ${id}`,
      team,
    );
  }

  @Delete(':id')
  @ApiResponse(TeamDto, { type: 'delete' })
  @Serialize(TeamDto)
  async remove(@Param('id') id: string) {
    const team = await this.teamsService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted team with the id of ${id}`,
      team,
    );
  }
}
