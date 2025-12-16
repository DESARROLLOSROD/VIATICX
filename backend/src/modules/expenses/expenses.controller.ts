import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto, FilterExpensesDto, ApproveExpenseDto, RejectExpenseDto } from './dto/expense.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo gasto' })
  @ApiResponse({ status: 201, description: 'Gasto creado exitosamente' })
  async create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(
      createExpenseDto,
      req.user.id,
      req.user.companyId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar gastos' })
  @ApiResponse({ status: 200, description: 'Lista de gastos' })
  async findAll(@Query() filters: FilterExpensesDto, @Request() req) {
    const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(req.user.role);
    return this.expensesService.findAll(
      filters,
      req.user.companyId,
      req.user.id,
      isAdmin,
    );
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Listar gastos pendientes de aprobación' })
  @ApiResponse({ status: 200, description: 'Lista de gastos pendientes' })
  async getPending(@Request() req) {
    return this.expensesService.getPendingExpenses(req.user.companyId);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obtener estadísticas de gastos' })
  @ApiResponse({ status: 200, description: 'Estadísticas' })
  async getStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    return this.expensesService.getStats(req.user.companyId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un gasto' })
  @ApiResponse({ status: 200, description: 'Detalle del gasto' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  async findOne(@Param('id') id: string, @Request() req) {
    const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(req.user.role);
    return this.expensesService.findOne(id, req.user.companyId, req.user.id, isAdmin);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar gasto' })
  @ApiResponse({ status: 200, description: 'Gasto actualizado' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req,
  ) {
    return this.expensesService.update(
      id,
      updateExpenseDto,
      req.user.companyId,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar gasto (cancelar)' })
  @ApiResponse({ status: 200, description: 'Gasto cancelado' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.expensesService.remove(id, req.user.companyId, req.user.id);
    return { message: 'Gasto cancelado exitosamente' };
  }

  @Post(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Aprobar gasto' })
  @ApiResponse({ status: 200, description: 'Gasto aprobado' })
  async approve(
    @Param('id') id: string,
    @Body() approveDto: ApproveExpenseDto,
    @Request() req,
  ) {
    return this.expensesService.approve(
      id,
      approveDto,
      req.user.companyId,
      req.user.id,
    );
  }

  @Post(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Rechazar gasto' })
  @ApiResponse({ status: 200, description: 'Gasto rechazado' })
  async reject(
    @Param('id') id: string,
    @Body() rejectDto: RejectExpenseDto,
    @Request() req,
  ) {
    return this.expensesService.reject(
      id,
      rejectDto,
      req.user.companyId,
      req.user.id,
    );
  }
}
