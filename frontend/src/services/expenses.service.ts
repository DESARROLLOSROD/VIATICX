import apiClient from '@/config/api';

export interface Expense {
  id: string;
  expenseDate: string;
  amount: number;
  currency: string;
  description: string;
  merchantName?: string;
  paymentMethod?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  hasReceipt: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  category?: {
    id: string;
    name: string;
  };
  project?: {
    id: string;
    name: string;
  };
  approver?: {
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  attachments?: Array<{
    id: string;
    fileName: string;
    filePath: string;
    fileType: string;
  }>;
}

export interface CreateExpenseData {
  expenseDate: string;
  amount: number;
  currency?: string;
  description: string;
  categoryId?: string;
  projectId?: string;
  merchantName?: string;
  paymentMethod?: string;
}

export interface FilterExpenses {
  status?: string;
  categoryId?: string;
  projectId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const expensesService = {
  async getExpenses(filters?: FilterExpenses) {
    const response = await apiClient.get('/expenses', { params: filters });
    return response.data;
  },

  async getExpense(id: string): Promise<Expense> {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data;
  },

  async createExpense(data: CreateExpenseData): Promise<Expense> {
    const response = await apiClient.post('/expenses', data);
    return response.data;
  },

  async updateExpense(id: string, data: Partial<CreateExpenseData>): Promise<Expense> {
    const response = await apiClient.patch(`/expenses/${id}`, data);
    return response.data;
  },

  async deleteExpense(id: string): Promise<void> {
    await apiClient.delete(`/expenses/${id}`);
  },

  async getPendingExpenses() {
    const response = await apiClient.get('/expenses/pending');
    return response.data;
  },

  async approveExpense(id: string, comments?: string): Promise<Expense> {
    const response = await apiClient.post(`/expenses/${id}/approve`, { comments });
    return response.data;
  },

  async rejectExpense(id: string, reason: string): Promise<Expense> {
    const response = await apiClient.post(`/expenses/${id}/reject`, { reason });
    return response.data;
  },

  async addAttachment(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/expenses/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getStats(startDate?: string, endDate?: string) {
    const response = await apiClient.get('/expenses/stats', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
