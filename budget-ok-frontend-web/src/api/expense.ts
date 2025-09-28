export type TransactionType = 'WITHDRAW' | 'DEPOSIT';

export interface Expense {
  id: string;
  envelopeId: string;
  amount: number;
  memo: string;
  description?: string;
  date: string;
  transactionType: TransactionType;
}

export interface CreateExpenseDto {
  amount: number;
  memo: string;
  description?: string;
  transactionType: TransactionType;
}

export const getExpensesByEnvelopeId = async (envelopeId: string): Promise<Expense[]> => {
  const response = await fetch(`/api/expenses?envelopeId=${envelopeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }
  return response.json();
};

export const createExpense = async (envelopeId: string, expense: CreateExpenseDto): Promise<Expense> => {
  const response = await fetch(`/api/expenses?envelopeId=${envelopeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  });
  if (!response.ok) {
    throw new Error('Failed to create expense');
  }
  return response.json();
};
