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
import { RoleGuard } from '../../guards/role.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { OrderBasicDataDto, OrderDto } from './dto/order.dto';
import { OrdersPaginationOptionsDto } from './dto/orders-pagination-options.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN', 'PLAYMAKER_SCOUT']))
@ApiCookieAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiResponse(OrderDto, { type: 'create' })
  @Serialize(OrderDto)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const order = await this.ordersService.create(createOrderDto, user.id);
    return formatSuccessResponse('Successfully created new order', order);
  }

  @Get()
  @ApiPaginatedResponse(OrderDto)
  @ApiQuery({ type: OrdersPaginationOptionsDto })
  @Serialize(OrderDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: OrdersPaginationOptionsDto,
    @Query() query: FindAllOrdersDto,
  ) {
    const data = await this.ordersService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all orders', data);
  }

  @Get('list')
  @ApiResponse(OrderBasicDataDto, { type: 'read' })
  @Serialize(OrderBasicDataDto)
  async getList(@Query() query: FindAllOrdersDto) {
    const orders = await this.ordersService.getList(query);
    return formatSuccessResponse(
      'Successfully fetched all orders list',
      orders,
    );
  }

  @Get(':id')
  @ApiResponse(OrderDto, { type: 'read' })
  @Serialize(OrderDto)
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    return formatSuccessResponse(`Successfully fetched order #${id}`, order);
  }

  @Patch(':id/accept')
  @ApiResponse(OrderDto, { type: 'update' })
  @Serialize(OrderDto)
  async accept(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    const order = await this.ordersService.accept(id, user.id);
    return formatSuccessResponse(
      `Successfully accepted order with the id of ${id}`,
      order,
    );
  }

  @Patch(':id/reject')
  @ApiResponse(OrderDto, { type: 'update' })
  @Serialize(OrderDto)
  async reject(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    const order = await this.ordersService.reject(id, user.id);
    return formatSuccessResponse(
      `Successfully rejected order with the id of ${id}`,
      order,
    );
  }

  @Patch(':id/close')
  @ApiResponse(OrderDto, { type: 'update' })
  @Serialize(OrderDto)
  async close(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    const order = await this.ordersService.close(id, user);
    return formatSuccessResponse(
      `Successfully closed order with the id of ${id}`,
      order,
    );
  }

  @Delete(':id')
  @ApiResponse(OrderDto, { type: 'delete' })
  @Serialize(OrderDto)
  async remove(@Param('id') id: string) {
    const order = await this.ordersService.remove(id);
    return formatSuccessResponse(`Successfully removed order #${id}`, order);
  }
}