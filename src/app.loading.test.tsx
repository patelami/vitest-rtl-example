import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import App from './App';
import { useTransactions } from './hooks/useTransactions';
import type { TransactionData } from './types';

vi.mock('./hooks/useTransactions');
const mockedUseTransactions = vi.mocked(useTransactions);

const initialMockState = {
  data: null,
  loading: false,
  error: null,
  fetchTransactions: vi.fn(),
  loadNextPage: vi.fn(),
};

describe('App Component', () => {
  beforeEach(() => {
    mockedUseTransactions.mockReturnValue({ ...initialMockState });
  });

  test('should render the heading and initial load button', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /transaction history/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /load transactions/i })).toBeInTheDocument();
  });
  describe('when loading is initiated', () => {
    beforeEach(() => {
      mockedUseTransactions.mockReturnValue({
        ...initialMockState,
        loading: true,
      });
      render(<App />);
    });

    test('should change the button text to "Loading..."', () => {
      expect(screen.getByRole('button', { name: /loading.../i })).toBeInTheDocument();
    });

    test('should disable the main button', () => {
      expect(screen.getByRole('button', { name: /loading.../i })).toBeDisabled();
    });

    test('should not display the "Load More" button', () => {
      expect(screen.queryByRole('button', { name: /load page/i })).not.toBeInTheDocument();
    });
  });

  describe('when data is fetched successfully', () => {
    const mockData: TransactionData = {
      currentPage: 1,
      totalPages: 2,
      transactions: [
        { id: '1', merchant: 'Coffee Shop', amount: -4.5, category: 'Food & Drink', date: '' },
        { id: '2', merchant: 'Train Station', amount: -12.0, category: 'Transport', date: '' },
      ],
      next: { page: 2 },
    };

    beforeEach(() => {
      mockedUseTransactions.mockReturnValue({
        ...initialMockState,
        data: mockData,
      });
      render(<App />);
    });

    test('should display the list of transactions', () => {
      expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
      expect(screen.getByText('Train Station')).toBeInTheDocument();
    });

    test('should display the "Load More" button with the correct label', () => {
      expect(screen.getByRole('button', { name: /load page 2 of 2/i })).toBeInTheDocument();
    });
  });

  describe('when an error occurs', () => {
    test('should display the error message', () => {
      mockedUseTransactions.mockReturnValue({
        ...initialMockState,
        loading: false,
        error: 'Something went wrong!',
        fetchTransactions: vi.fn(),
        loadNextPage: vi.fn(),
      });

      render(<App />);
      expect(screen.getByText(/Error: Something went wrong!/i)).toBeInTheDocument();
    });

    test('should clear the error message when loading is re-initiated', () => {
      mockedUseTransactions.mockReturnValue({
        ...initialMockState,
        loading: false,
        error: 'Something went wrong!',
      });
      const { rerender } = render(<App />);

      expect(screen.getByText(/Error: Something went wrong!/i)).toBeInTheDocument();

      mockedUseTransactions.mockReturnValue({
        ...initialMockState,
        loading: true,
      });
      rerender(<App />);

      expect(screen.queryByText(/Error: Something went wrong!/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
    });
  });

  describe('when interacting with buttons', () => {
    test('should call fetchTransactions when "Load Transactions" is clicked', async () => {
      const fetchTransactionsMock = vi.fn();
      mockedUseTransactions.mockReturnValue({
        ...initialMockState,
        fetchTransactions: fetchTransactionsMock,
      });

      render(<App />);
      await userEvent.click(screen.getByRole('button', { name: /load transactions/i }));

      expect(fetchTransactionsMock).toHaveBeenCalledTimes(1);
    });

    test('should call loadNextPage when "Load More" is clicked', async () => {
      const loadNextPageMock = vi.fn();
      mockedUseTransactions.mockReturnValue({
        ...initialMockState,
        data: { currentPage: 1, totalPages: 2, transactions: [], next: { page: 2 } },
        loadNextPage: loadNextPageMock,
      });

      render(<App />);
      await userEvent.click(screen.getByRole('button', { name: /load page 2 of 2/i }));

      expect(loadNextPageMock).toHaveBeenCalledTimes(1);
    });
  });
});
