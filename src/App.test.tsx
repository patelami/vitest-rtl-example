import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

test('sample test', () => {
  expect(true).toBe(true);
});

test('renders main heading and load transactions button', () => {
  render(<App />);

  // Your tests go here
});
