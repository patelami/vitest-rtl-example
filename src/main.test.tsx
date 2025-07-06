import { createRoot } from 'react-dom/client';
import App from './App';
import { StrictMode } from 'react';
import { describe, test, expect, beforeEach, afterEach, vi, Mock } from 'vitest';

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(),
}));

describe('Application Root (App.tsx)', () => {
  const mockRender = vi.fn();
  let rootElement: HTMLElement | null;

  beforeEach(() => {
    vi.clearAllMocks();
    (createRoot as Mock).mockReturnValue({ render: mockRender });
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    if (rootElement) {
      document.body.removeChild(rootElement);
    }
    rootElement = null;
  });

  test('should find the root element and render the App component within StrictMode', async () => {
    await import('./main.tsx');
    expect(createRoot).toHaveBeenCalledWith(rootElement);
    expect(createRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledWith(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
});
