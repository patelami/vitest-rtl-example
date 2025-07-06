import { describe, test, expect, expectTypeOf } from 'vitest';
import type {
  Transaction,
  TransactionResponse,
  FlexibleTransaction,
  TransactionCategory,
} from './types';
const mockTransaction: Transaction = {
  id: 1,
  date: '2025-07-06T19:55:00.000Z',
  amount: -55.5,
  merchant: 'Online Store',
  category: 'shopping',
};

const mockTransactionResponse: TransactionResponse = {
  currentPage: 1,
  next: {
    page: 2,
    limit: 10,
  },
  totalPages: 5,
  transactions: [mockTransaction],
};

const getShoppingTransactions = (transactions: Transaction[]): Transaction[] => {
  return transactions.filter(t => t.category === 'shopping');
};

describe('Transaction Utilities', () => {
  test('getShoppingTransactions should only return transactions with "shopping" category', () => {
    const transactions: Transaction[] = [
      mockTransaction,
      {
        id: 2,
        date: '2025-07-05T12:00:00.000Z',
        amount: -120.0,
        merchant: 'Airline',
        category: 'travel',
      },
      {
        id: 3,
        date: '2025-07-04T08:30:00.000Z',
        amount: -25.0,
        merchant: 'Supermarket',
        category: 'shopping',
      },
    ];

    const result = getShoppingTransactions(transactions);

    expect(result).toHaveLength(2);

    expect(result.every(t => t.category === 'shopping')).toBe(true);
  });
});

describe('Transaction Interface Types', () => {
  test('Transaction should have the correct property types', () => {
    expectTypeOf(mockTransaction).toMatchTypeOf<Transaction>();

    expectTypeOf(mockTransaction.id).toBeNumber();
    expectTypeOf(mockTransaction.date).toBeString();
    expectTypeOf(mockTransaction.amount).toBeNumber();
    expectTypeOf(mockTransaction.merchant).toBeString();
    expectTypeOf(mockTransaction.category).toEqualTypeOf<
      'shopping' | 'travel' | 'gambling' | 'bills' | 'personal' | 'transport' | 'home'
    >();
  });

  test('FlexibleTransaction should allow for any string as a category', () => {
    const flexibleTx: FlexibleTransaction = {
      id: 100,
      date: '2025-07-06T10:00:00.000Z',
      amount: 500,
      merchant: 'Freelance Client',
      category: 'income',
    };
    expectTypeOf(flexibleTx.category).toBeString();
    expectTypeOf(flexibleTx.category).toMatchTypeOf<TransactionCategory>();
  });

  test('Transaction should be assignable to FlexibleTransaction', () => {
    expectTypeOf<Transaction>().toMatchTypeOf<FlexibleTransaction>();
  });

  test('TransactionResponse should have the correct structure', () => {
    expectTypeOf(mockTransactionResponse).toMatchTypeOf<TransactionResponse>();
    expectTypeOf(mockTransactionResponse.transactions).toEqualTypeOf<Transaction[]>();
  });
});
