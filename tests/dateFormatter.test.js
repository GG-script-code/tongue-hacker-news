import { describe, it, expect } from 'vitest';
import { formatDate } from '@/js/utils/dateFormatter.js';

describe('formatDate', () => {
  it('returns a non-empty string for a valid timestamp', () => {
    const result = formatDate(1700000000);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns fallback for null', () => {
    expect(formatDate(null)).toBe('Data sconosciuta');
  });

  it('returns fallback for undefined', () => {
    expect(formatDate(undefined)).toBe('Data sconosciuta');
  });

  it('returns fallback for zero', () => {
    expect(formatDate(0)).toBe('Data sconosciuta');
  });

  it('includes the year in the output', () => {
    const result = formatDate(1700000000);
    expect(result).toContain('2023');
  });
});
