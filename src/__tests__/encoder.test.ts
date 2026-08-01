/**
 * Unit tests for StringEncoder
 */

import { StringEncoder } from '../utils/encoder';

describe('StringEncoder', () => {
  describe('Base64 Encoding', () => {
    it('should encode string to base64', () => {
      const input = 'hello world';
      const encoded = StringEncoder.toBase64(input);
      expect(encoded).toBe('aGVsbG8gd29ybGQ=');
    });

    it('should decode base64 string', () => {
      const encoded = 'aGVsbG8gd29ybGQ=';
      const decoded = StringEncoder.fromBase64(encoded);
      expect(decoded).toBe('hello world');
    });
  });

  describe('Hex Encoding', () => {
    it('should encode string to hex', () => {
      const input = 'ABC';
      const encoded = StringEncoder.toHex(input);
      expect(encoded).toBe('414243');
    });

    it('should decode hex string', () => {
      const encoded = '414243';
      const decoded = StringEncoder.fromHex(encoded);
      expect(decoded).toBe('ABC');
    });
  });

  describe('Unicode Encoding', () => {
    it('should encode string to unicode escapes', () => {
      const input = 'Hi';
      const encoded = StringEncoder.toUnicode(input);
      expect(encoded).toContain('\\u');
    });
  });

  describe('XOR Encoding', () => {
    it('should encode and decode with XOR', () => {
      const input = 'secret';
      const key = 42;
      const { encoded } = StringEncoder.toXOR(input, key);
      const decoded = StringEncoder.fromXOR(encoded, key);
      expect(decoded).toBe(input);
    });
  });
});
