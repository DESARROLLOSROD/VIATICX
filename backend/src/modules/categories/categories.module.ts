import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseCategory } from './expense-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseCategory])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class CategoriesModule {}
