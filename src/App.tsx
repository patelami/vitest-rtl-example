import { useState } from 'react';
import './App.css';
import type { TransactionResponse, Transaction } from './types';

function App() {
  const [transactionData, setTransactionData] = useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://tip-transactions.vercel.app/api';
      const response = await fetch(`${apiUrl}/transactions?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction data');
      }
      const data: TransactionResponse = await response.json();
      setTransactionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      shopping: '#e74c3c',
      travel: '#3498db',
      gambling: '#9b59b6',
      bills: '#f39c12',
      personal: '#2ecc71',
      transport: '#34495e',
      home: '#e67e22',
    };
    return colors[category as keyof typeof colors] || '#95a5a6';
  };

  const loadNextPage = () => {
    if (transactionData?.next) {
      fetchTransactions(transactionData.next.page);
    }
  };

  return (
    <div className="app">
      <main className="container">
        <header>
          <h1>Transaction History</h1>
          <p className="subtitle">View your recent financial transactions</p>
        </header>

        <div className="controls">
          <button
            onClick={() => fetchTransactions(1)}
            disabled={loading}
            className="fetch-button"
            aria-describedby={transactionData ? 'transaction-list' : undefined}
          >
            {loading ? 'Loading...' : 'Load Transactions'}
          </button>

          {transactionData && transactionData.next && (
            <button
              onClick={loadNextPage}
              disabled={loading}
              className="load-more-button"
              aria-label={`Load page ${transactionData.next.page} of ${transactionData.totalPages}`}
            >
              Load More
            </button>
          )}
        </div>

        {error && (
          <div className="error" role="alert" aria-live="polite">
            <p>Error: {error}</p>
          </div>
        )}

        {transactionData && (
          <section className="transaction-section" aria-live="polite">
            <div className="pagination-info" aria-label="Pagination information">
              <p>
                Page {transactionData.currentPage} of {transactionData.totalPages} (
                {transactionData.transactions.length} transactions)
              </p>
            </div>

            <div
              id="transaction-list"
              className="transaction-list"
              role="list"
              aria-label="Transaction list"
            >
              {transactionData.transactions.map((transaction: Transaction) => (
                <article
                  key={transaction.id}
                  className="transaction-item"
                  role="listitem"
                  tabIndex={0}
                  aria-labelledby={`transaction-${transaction.id}-merchant`}
                  aria-describedby={`transaction-${transaction.id}-details`}
                >
                  <div className="transaction-header">
                    <h3 id={`transaction-${transaction.id}-merchant`} className="merchant-name">
                      {transaction.merchant}
                    </h3>
                    <span
                      className="transaction-amount"
                      aria-label={`Amount: ${formatAmount(transaction.amount)}`}
                    >
                      {formatAmount(transaction.amount)}
                    </span>
                  </div>

                  <div id={`transaction-${transaction.id}-details`} className="transaction-details">
                    <time
                      dateTime={transaction.date}
                      className="transaction-date"
                      aria-label={`Transaction date: ${formatDate(transaction.date)}`}
                    >
                      {formatDate(transaction.date)}
                    </time>
                    <span
                      className="transaction-category"
                      style={{
                        backgroundColor: getCategoryColor(transaction.category),
                      }}
                      aria-label={`Category: ${transaction.category}`}
                    >
                      {transaction.category}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
