import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ClubsService } from './clubs.service';
import { ClubDto } from './dto/club.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { FindAllClubsDto } from './dto/find-all-clubs.dto';
import { ClubsPaginationOptionsDto } from './dto/clubs-pagination-options.dto';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { ApiPaginatedResponse } from '../../api-response/api-paginated-response.decorator';
import { Serialize } from '../../interceptors/serialize.interceptor';

@Controller('clubs')
@ApiTags('clubs')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @ApiResponse(ClubDto, { type: 'read' })
  @Serialize(ClubDto)
  async create(
    @Body() createClubDto: CreateClubDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const club = await this.clubsService.create(createClubDto, user.id);
    return formatSuccessResponse('Successfully created new club', club);
  }

  @Get()
  @ApiPaginatedResponse(ClubDto)
  @ApiQuery({ type: ClubsPaginationOptionsDto })
  @Serialize(ClubDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: ClubsPaginationOptionsDto,
    @Query() query: FindAllClubsDto,
  ) {
    const data = await this.clubsService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all clubs', data);
  }

  @Get(':id')
  @ApiResponse(ClubDto, { type: 'read' })
  @Serialize(ClubDto)
  async findOne(@Param('id') id: string) {
    const club = await this.clubsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched club with the id of ${id}`,
      club,
    );
  }

  @Patch(':id')
  @ApiResponse(ClubDto, { type: 'update' })
  @Serialize(ClubDto)
  async update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    const club = await this.clubsService.update(id, updateClubDto);
    return formatSuccessResponse(
      `Successfully updated club with the id of ${id}`,
      club,
    );
  }

  @Delete(':id')
  @Serialize(ClubDto)
  async remove(@Param('id') id: string) {
    const club = await this.clubsService.remove(id);
    return formatSuccessResponse(
      `Successfully removed club with the id of ${id}`,
      club,
    );
  }
}