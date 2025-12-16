import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Expense } from './expense.entity';

@Entity('attachments')
export class Attachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'file_name' })
    fileName: string;

    @Column({ name: 'file_path' })
    filePath: string;

    @Column({ name: 'file_type' })
    fileType: string;

    @Column({ name: 'expense_id' })
    expenseId: string;

    @ManyToOne(() => Expense, (expense) => expense.attachments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'expense_id' })
    expense: Expense;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
