import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import App from './App';

describe('Error state works', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders main heading and load transactions button', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /transaction history/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /load transactions/i })).toBeInTheDocument();
  });

  test("displays an error message with 'Failed to fetch transaction data' when the network request fails", async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api');
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false,
    } as Response);

    render(<App />);
    const user = userEvent.setup();

    const loadButton = screen.getByRole('button', { name: /load transactions/i });
    await user.click(loadButton);

    const errorMessage = await screen.findByText(/Error: Failed to fetch transaction data/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("displays an error message with 'API URL not configured' when the environment variable is not set", async () => {
    vi.stubEnv('VITE_API_BASE_URL', '');

    render(<App />);
    const user = userEvent.setup();

    const loadButton = screen.getByRole('button', { name: /load transactions/i });
    await user.click(loadButton);

    const errorMessage = await screen.findByText(
      /Error: API URL not configured. Please set VITE_API_BASE_URL in your .env file/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("displays a generic error message 'An error occurred' for non-Error exceptions", async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api');

    vi.spyOn(window, 'fetch').mockRejectedValue('a random string error');

    render(<App />);
    const user = userEvent.setup();

    const loadButton = screen.getByRole('button', { name: /load transactions/i });
    await user.click(loadButton);

    const errorMessage = await screen.findByText(/Error: An error occurred/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
