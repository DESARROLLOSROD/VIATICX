import { describe, it, expect } from 'vitest';
import {
  validatePassword,
  validateRFC,
  validateEmail,
  validateFileType,
  validateFileSize,
} from './validation';

describe('validation utilities', () => {
  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('MyPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('mypass123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Debe contener al menos una mayúscula');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('MYPASS123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Debe contener al menos una minúscula');
    });

    it('should reject password without number', () => {
      const result = validatePassword('MyPassword!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Debe contener al menos un número');
    });

    it('should reject password without special character', () => {
      const result = validatePassword('MyPass123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Debe contener al menos un carácter especial');
    });

    it('should reject short password', () => {
      const result = validatePassword('Pass1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Debe tener al menos 8 caracteres');
    });

    it('should accumulate multiple errors', () => {
      const result = validatePassword('short');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateRFC', () => {
    it('should validate correct RFC persona física', () => {
      expect(validateRFC('ABCD890123XYZ')).toBe(true);
    });

    it('should validate correct RFC persona moral', () => {
      expect(validateRFC('ABC890123XYZ')).toBe(true);
    });

    it('should reject invalid RFC format', () => {
      expect(validateRFC('INVALID')).toBe(false);
      expect(validateRFC('ABC123')).toBe(false);
    });

    it('should reject RFC with wrong length', () => {
      expect(validateRFC('ABC12345')).toBe(false);
      expect(validateRFC('ABCD1234567890XYZ')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user @domain.com')).toBe(false);
    });
  });

  describe('validateFileType', () => {
    it('should validate allowed file types', () => {
      const jpegFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const pngFile = new File([''], 'test.png', { type: 'image/png' });
      const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });

      expect(validateFileType(jpegFile)).toBe(true);
      expect(validateFileType(pngFile)).toBe(true);
      expect(validateFileType(pdfFile)).toBe(true);
    });

    it('should reject disallowed file types', () => {
      const execFile = new File([''], 'test.exe', { type: 'application/x-msdownload' });
      const zipFile = new File([''], 'test.zip', { type: 'application/zip' });

      expect(validateFileType(execFile)).toBe(false);
      expect(validateFileType(zipFile)).toBe(false);
    });

    it('should validate custom allowed types', () => {
      const textFile = new File([''], 'test.txt', { type: 'text/plain' });
      expect(validateFileType(textFile, ['text/plain'])).toBe(true);
      expect(validateFileType(textFile, ['image/jpeg'])).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should validate files within size limit', () => {
      const smallFile = new File(['a'.repeat(1024)], 'small.txt'); // 1KB
      expect(validateFileSize(smallFile, 10)).toBe(true);
    });

    it('should reject files exceeding size limit', () => {
      const largeFile = new File(['a'.repeat(11 * 1024 * 1024)], 'large.txt'); // 11MB
      expect(validateFileSize(largeFile, 10)).toBe(false);
    });

    it('should use default max size of 10MB', () => {
      const file5MB = new File(['a'.repeat(5 * 1024 * 1024)], 'file.txt');
      expect(validateFileSize(file5MB)).toBe(true);
    });
  });
});
