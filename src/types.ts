export interface Transaction {
  id: number;
  date: string; // ISO date string
  amount: number;
  merchant: string;
  category: 'shopping' | 'travel' | 'gambling' | 'bills' | 'personal' | 'transport' | 'home';
}

export interface PaginationNext {
  page: number;
  limit: number;
}

export interface TransactionResponse {
  currentPage: number;
  next: PaginationNext;
  totalPages: number;
  transactions: Transaction[];
}

// Alternative category type if you want to be more flexible
export type TransactionCategory =
  | 'shopping'
  | 'travel'
  | 'gambling'
  | 'bills'
  | 'personal'
  | 'transport'
  | 'home'
  | string; // Allow for other categories not in the sample

// You can use this if you want more flexible categories
export interface FlexibleTransaction {
  id: number;
  date: string;
  amount: number;
  merchant: string;
  category: TransactionCategory;
}
