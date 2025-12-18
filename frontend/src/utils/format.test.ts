import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, parseCurrency, truncate } from './format';

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-500.25)).toBe('-$500.25');
    });

    it('should handle decimal precision', () => {
      expect(formatCurrency(99.9)).toBe('$99.90');
      expect(formatCurrency(10.5)).toBe('$10.50');
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2024-12-18T10:30:00');

    it('should format date in short format by default', () => {
      const result = formatDate(testDate, 'short');
      expect(result).toContain('18');
      expect(result).toContain('dic');
      expect(result).toContain('2024');
    });

    it('should format date from string', () => {
      const result = formatDate('2024-12-18', 'short');
      expect(result).toBeTruthy();
    });

    it('should handle different format types', () => {
      const shortResult = formatDate(testDate, 'short');
      const mediumResult = formatDate(testDate, 'medium');
      const longResult = formatDate(testDate, 'long');

      expect(shortResult).toBeTruthy();
      expect(mediumResult).toBeTruthy();
      expect(longResult).toBeTruthy();
      expect(longResult.length).toBeGreaterThan(shortResult.length);
    });
  });

  describe('parseCurrency', () => {
    it('should parse currency strings correctly', () => {
      expect(parseCurrency('$1,234.56')).toBe(1234.56);
      expect(parseCurrency('$10.00')).toBe(10);
    });

    it('should handle negative values', () => {
      expect(parseCurrency('-$500.25')).toBe(-500.25);
    });

    it('should handle plain numbers', () => {
      expect(parseCurrency('1234.56')).toBe(1234.56);
    });

    it('should handle zero', () => {
      expect(parseCurrency('$0.00')).toBe(0);
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncate(longText, 20)).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncate(shortText, 20)).toBe('Short text');
    });

    it('should handle exact length match', () => {
      const text = '12345';
      expect(truncate(text, 5)).toBe('12345');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });
  });
});
