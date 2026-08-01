/**
 * Unit tests for IdentifierRenamer
 */

import * as t from '@babel/types';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import { Obfuscator } from '../index';

describe('Obfuscator', () => {
  describe('Basic Obfuscation', () => {
    it('should rename identifiers', () => {
      const code = `
        function calculateSum(a, b) {
          const result = a + b;
          return result;
        }
      `;

      const obfuscator = new Obfuscator({
        renameIdentifiers: true,
        encodeStrings: false,
        removeComments: false,
        compact: false,
      });

      const result = obfuscator.obfuscate(code);
      expect(result.code).not.toContain('calculateSum');
      expect(result.code).not.toContain('result');
      expect(result.stats.identifiersRenamed).toBeGreaterThan(0);
    });

    it('should remove comments', () => {
      const code = `
        // This is a comment
        const x = 5; /* inline comment */
        /* block comment */
      `;

      const obfuscator = new Obfuscator({
        removeComments: true,
        encodeStrings: false,
        renameIdentifiers: false,
        compact: false,
      });

      const result = obfuscator.obfuscate(code);
      expect(result.code).not.toContain('//This is a comment');
    });

    it('should preserve specified names', () => {
      const code = `
        function myFunction() {
          console.log('test');
        }
      `;

      const obfuscator = new Obfuscator({
        renameIdentifiers: true,
        preservedNames: ['myFunction', 'console'],
        compact: false,
      });

      const result = obfuscator.obfuscate(code);
      expect(result.code).toContain('myFunction');
    });
  });

  describe('String Encoding', () => {
    it('should encode strings to base64', () => {
      const code = `const secret = "my-secret-key";`;

      const obfuscator = new Obfuscator({
        encodeStrings: true,
        stringsEncoding: 'base64',
        renameIdentifiers: false,
        compact: false,
      });

      const result = obfuscator.obfuscate(code);
      expect(result.code).not.toContain('my-secret-key');
      expect(result.stats.stringsEncoded).toBeGreaterThan(0);
    });
  });

  describe('Presets', () => {
    it('should apply low preset', () => {
      const code = `
        function test(x) {
          // comment
          return x + 1;
        }
      `;

      const obfuscator = new Obfuscator({ preset: 'low' });
      const result = obfuscator.obfuscate(code);

      expect(result.stats.identifiersRenamed).toBeGreaterThan(0);
    });

    it('should apply medium preset', () => {
      const code = `
        function test(x) {
          if (x > 0) {
            return x * 2;
          }
          return 0;
        }
      `;

      const obfuscator = new Obfuscator({ preset: 'medium' });
      const result = obfuscator.obfuscate(code);

      expect(result.code.length).toBeGreaterThan(0);
    });

    it('should apply high preset', () => {
      const code = `
        const data = { key: 'value', number: 42 };
        console.log(data);
      `;

      const obfuscator = new Obfuscator({ preset: 'high' });
      const result = obfuscator.obfuscate(code);

      expect(result.code.length).toBeGreaterThan(0);
    });
  });

  describe('Compaction', () => {
    it('should compact code when enabled', () => {
      const code = `
        function test() {
          const x = 1;
          return x;
        }
      `;

      const obfuscator = new Obfuscator({ compact: true });
      const result = obfuscator.obfuscate(code);

      expect(result.code).not.toContain('\n');
    });

    it('should not compact code when disabled', () => {
      const code = `
        function test() {
          const x = 1;
          return x;
        }
      `;

      const obfuscator = new Obfuscator({ compact: false });
      const result = obfuscator.obfuscate(code);

      // Should have some newlines
      expect(result.code.includes('\n') || result.code.includes('\r\n')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should throw error on invalid JavaScript', () => {
      const invalidCode = `
        function test() {
          return {
      `; // Missing closing brace and parenthesis

      const obfuscator = new Obfuscator();
      expect(() => obfuscator.obfuscate(invalidCode)).toThrow();
    });
  });

  describe('Statistics', () => {
    it('should calculate correct statistics', () => {
      const code = `const x = 10;`;

      const obfuscator = new Obfuscator();
      const result = obfuscator.obfuscate(code);

      expect(result.stats.originalSize).toBeGreaterThan(0);
      expect(result.stats.obfuscatedSize).toBeGreaterThan(0);
      expect(result.stats.executionTime).toBeGreaterThan(0);
    });
  });
});
