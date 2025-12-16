import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense, ExpenseStatus } from './expense.entity';
import { CreateExpenseDto, UpdateExpenseDto, FilterExpensesDto, ApproveExpenseDto, RejectExpenseDto } from './dto/expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string, companyId: string): Promise<Expense> {
    const expense = this.expensesRepository.create({
      ...createExpenseDto,
      userId,
      companyId,
      status: ExpenseStatus.PENDING,
    });

    return this.expensesRepository.save(expense);
  }

  async findAll(filters: FilterExpensesDto, companyId: string, userId?: string, isAdmin?: boolean) {
    const { page = 1, limit = 50, status, categoryId, projectId, userId: filterUserId, startDate, endDate } = filters;

    const queryBuilder = this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.user', 'user')
      .leftJoinAndSelect('expense.category', 'category')
      .leftJoinAndSelect('expense.project', 'project')
      .leftJoinAndSelect('expense.approver', 'approver')
      .where('expense.companyId = :companyId', { companyId });

    // Si no es admin, solo ver sus propios gastos
    if (!isAdmin && userId) {
      queryBuilder.andWhere('expense.userId = :userId', { userId });
    }

    // Filtros
    if (status) {
      queryBuilder.andWhere('expense.status = :status', { status });
    }

    if (categoryId) {
      queryBuilder.andWhere('expense.categoryId = :categoryId', { categoryId });
    }

    if (projectId) {
      queryBuilder.andWhere('expense.projectId = :projectId', { projectId });
    }

    if (filterUserId) {
      queryBuilder.andWhere('expense.userId = :filterUserId', { filterUserId });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('expense.expenseDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // Ordenar por fecha descendente
    queryBuilder.orderBy('expense.expenseDate', 'DESC');

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, companyId: string, userId?: string, isAdmin?: boolean): Promise<Expense> {
    const expense = await this.expensesRepository.findOne({
      where: { id, companyId },
      relations: ['user', 'category', 'project', 'approver'],
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    // Verificar permisos
    if (!isAdmin && expense.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este gasto');
    }

    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
    companyId: string,
    userId: string,
  ): Promise<Expense> {
    const expense = await this.findOne(id, companyId, userId, false);

    // Solo se puede editar si está pendiente
    if (expense.status !== ExpenseStatus.PENDING) {
      throw new BadRequestException('Solo se pueden editar gastos pendientes');
    }

    // Solo el dueño puede editar
    if (expense.userId !== userId) {
      throw new ForbiddenException('Solo puedes editar tus propios gastos');
    }

    Object.assign(expense, updateExpenseDto);
    return this.expensesRepository.save(expense);
  }

  async remove(id: string, companyId: string, userId: string): Promise<void> {
    const expense = await this.findOne(id, companyId, userId, false);

    if (expense.status !== ExpenseStatus.PENDING) {
      throw new BadRequestException('Solo se pueden eliminar gastos pendientes');
    }

    if (expense.userId !== userId) {
      throw new ForbiddenException('Solo puedes eliminar tus propios gastos');
    }

    expense.status = ExpenseStatus.CANCELLED;
    await this.expensesRepository.save(expense);
  }

  async approve(
    id: string,
    approveDto: ApproveExpenseDto,
    companyId: string,
    approverId: string,
  ): Promise<Expense> {
    const expense = await this.expensesRepository.findOne({
      where: { id, companyId },
      relations: ['user'],
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    if (expense.status !== ExpenseStatus.PENDING) {
      throw new BadRequestException('Solo se pueden aprobar gastos pendientes');
    }

    expense.status = ExpenseStatus.APPROVED;
    expense.approvedBy = approverId;
    expense.approvedAt = new Date();
    expense.approvalNotes = approveDto.comments;

    return this.expensesRepository.save(expense);
  }

  async reject(
    id: string,
    rejectDto: RejectExpenseDto,
    companyId: string,
    approverId: string,
  ): Promise<Expense> {
    const expense = await this.expensesRepository.findOne({
      where: { id, companyId },
      relations: ['user'],
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    if (expense.status !== ExpenseStatus.PENDING) {
      throw new BadRequestException('Solo se pueden rechazar gastos pendientes');
    }

    expense.status = ExpenseStatus.REJECTED;
    expense.approvedBy = approverId;
    expense.approvedAt = new Date();
    expense.rejectedReason = rejectDto.reason;

    return this.expensesRepository.save(expense);
  }

  async getPendingExpenses(companyId: string) {
    return this.expensesRepository.find({
      where: {
        companyId,
        status: ExpenseStatus.PENDING,
      },
      relations: ['user', 'category', 'project'],
      order: {
        expenseDate: 'DESC',
      },
    });
  }

  async getStats(companyId: string, startDate?: string, endDate?: string) {
    const queryBuilder = this.expensesRepository
      .createQueryBuilder('expense')
      .where('expense.companyId = :companyId', { companyId });

    if (startDate && endDate) {
      queryBuilder.andWhere('expense.expenseDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const totalExpenses = await queryBuilder.getCount();
    
    const pending = await queryBuilder
      .clone()
      .andWhere('expense.status = :status', { status: ExpenseStatus.PENDING })
      .getCount();

    const approved = await queryBuilder
      .clone()
      .andWhere('expense.status = :status', { status: ExpenseStatus.APPROVED })
      .getCount();

    const rejected = await queryBuilder
      .clone()
      .andWhere('expense.status = :status', { status: ExpenseStatus.REJECTED })
      .getCount();

    const totalAmount = await queryBuilder
      .select('SUM(expense.amount)', 'sum')
      .getRawOne();

    const approvedAmount = await queryBuilder
      .clone()
      .andWhere('expense.status = :status', { status: ExpenseStatus.APPROVED })
      .select('SUM(expense.amount)', 'sum')
      .getRawOne();

    return {
      totalExpenses,
      pending,
      approved,
      rejected,
      totalAmount: parseFloat(totalAmount?.sum || '0'),
      approvedAmount: parseFloat(approvedAmount?.sum || '0'),
    };
  }
}
