import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';
import { ExpenseCategory } from '../categories/expense-category.entity';
import { Project } from '../projects/project.entity';
import { Attachment } from './attachment.entity';

export enum ExpenseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ManyToOne(() => ExpenseCategory, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: ExpenseCategory;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @ManyToOne(() => Project, { eager: true, nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'expense_date', type: 'date' })
  expenseDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'MXN' })
  currency: string;

  @Column('text')
  description: string;

  @Column({ name: 'merchant_name', nullable: true })
  merchantName: string;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @Column({ name: 'invoice_folio', nullable: true })
  invoiceFolio: string;

  @Column({ name: 'rfc_vendor', nullable: true })
  rfcVendor: string;

  @Column({ name: 'is_tax_deductible', default: false })
  isTaxDeductible: boolean;

  @Column({
    type: 'enum',
    enum: ExpenseStatus,
    default: ExpenseStatus.PENDING,
  })
  status: ExpenseStatus;

  @Column({ name: 'approval_notes', type: 'text', nullable: true })
  approvalNotes: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approver: User;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ name: 'rejected_reason', type: 'text', nullable: true })
  rejectedReason: string;

  @Column({ name: 'has_receipt', default: false })
  hasReceipt: boolean;

  @Column({ name: 'ocr_processed', default: false })
  ocrProcessed: boolean;

  @Column({ name: 'ocr_confidence', type: 'decimal', precision: 5, scale: 2, nullable: true })
  ocrConfidence: number;

  @Column({ default: false })
  exported: boolean;

  @Column({ name: 'exported_at', type: 'timestamp', nullable: true })
  exportedAt: Date;

  @Column({ name: 'batch_number', nullable: true })
  batchNumber: string;

  @OneToMany(() => Attachment, (attachment) => attachment.expense, { cascade: true })
  attachments: Attachment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
