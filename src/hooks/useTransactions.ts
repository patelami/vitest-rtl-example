import { useState } from 'react';
import type { TransactionResponse } from '../types';

// Discriminated union types for proper state combinations
type TransactionState =
  | {
      data: null;
      loading: true;
      error: null;
    }
  | {
      data: TransactionResponse;
      loading: false;
      error: null;
    }
  | {
      data: null;
      loading: false;
      error: string;
    }
  | {
      data: null;
      loading: false;
      error: null;
    };

type UseTransactionsReturn = TransactionState & {
  fetchTransactions: (page?: number) => Promise<void>;
  loadNextPage: () => Promise<void>;
};

export const useTransactions = (): UseTransactionsReturn => {
  const [state, setState] = useState<TransactionState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchTransactions = async (page: number = 1): Promise<void> => {
    setState({ data: null, loading: true, error: null });

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      if (!apiUrl) {
        throw new Error('API URL not configured. Please set VITE_API_BASE_URL in your .env file');
      }

      const response = await fetch(`${apiUrl}/transactions?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction data');
      }

      const data: TransactionResponse = await response.json();
      setState({ data, loading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  };

  const loadNextPage = async (): Promise<void> => {
    if (state.data?.next) {
      await fetchTransactions(state.data.next.page);
    }
  };

  return {
    ...state,
    fetchTransactions,
    loadNextPage,
  };
};
