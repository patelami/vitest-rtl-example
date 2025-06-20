import { formatDate, formatAmount, getCategoryColor } from './utils';
import { describe, it, expect } from 'vitest';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = '2025-01-01T00:00:00Z';
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe('1 Jan 2025, 00:00');
  });
  it('should format format a positive number into gbp currency', () => {
    const amount = 100;
    const formattedAmount = formatAmount(amount);
    expect(formattedAmount).toBe('£100.00');
  });
  it('should format a negative number into gbp currency', () => {
    const amount = -100;
    const formattedAmount = formatAmount(amount);
    expect(formattedAmount).toBe('-£100.00');
  });
  it('should format a zero correctly', () => {
    const amount = 0;
    const formattedAmount = formatAmount(amount);
    expect(formattedAmount).toBe('£0.00');
  });
});

describe('getCategoryColor', () => {
  it('should return the correct color for a known category', () => {
    expect(getCategoryColor('Shopping')).toBe('#33FF57');
    expect(getCategoryColor('Transport')).toBe('#3357FF');
  });
  it('should return the default color for an unknown category', () => {
    expect(getCategoryColor('unknown_category')).toBe('#FF3333');
  });
  it('should return the correct color for a category', () => {
    const category = 'Food & Drink';
    const color = getCategoryColor(category);
    expect(color).toBe('#FF5733');
  });
  it('should return default color for an unknown category', () => {
    const category = 'Unknown';
    const color = getCategoryColor(category);
    expect(color).toBe('#FF3333');
  });

  it('should return default colour for case-sensitive ', () => {
    const category = 'food & drink';
    const color = getCategoryColor(category);
    expect(color).toBe('#FF3333');
  });

  it('should return default colour for empty string', () => {
    const category = '';
    const color = getCategoryColor(category);
    expect(color).toBe('#FF3333');
  });
});
