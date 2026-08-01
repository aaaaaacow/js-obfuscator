/**
 * Unit tests for ASTUtils
 */

import * as t from '@babel/types';
import { ASTUtils } from '../utils/ast-utils';

describe('ASTUtils', () => {
  describe('Literal Detection', () => {
    it('should detect string literals', () => {
      const node = t.stringLiteral('test');
      expect(ASTUtils.isSimpleLiteral(node)).toBe(true);
    });

    it('should detect numeric literals', () => {
      const node = t.numericLiteral(42);
      expect(ASTUtils.isSimpleLiteral(node)).toBe(true);
    });

    it('should detect boolean literals', () => {
      const node = t.booleanLiteral(true);
      expect(ASTUtils.isSimpleLiteral(node)).toBe(true);
    });
  });

  describe('Expression Evaluation', () => {
    it('should evaluate simple arithmetic', () => {
      const expr = t.binaryExpression('+', t.numericLiteral(5), t.numericLiteral(3));
      const result = ASTUtils.evaluateExpression(expr);
      expect(result).toBe(8);
    });

    it('should evaluate unary expressions', () => {
      const expr = t.unaryExpression('!', t.booleanLiteral(true));
      const result = ASTUtils.evaluateExpression(expr);
      expect(result).toBe(false);
    });
  });

  describe('Literal Creation', () => {
    it('should create string literal', () => {
      const literal = ASTUtils.createLiteral('test');
      expect(t.isStringLiteral(literal)).toBe(true);
    });

    it('should create numeric literal', () => {
      const literal = ASTUtils.createLiteral(42);
      expect(t.isNumericLiteral(literal)).toBe(true);
    });
  });
});
