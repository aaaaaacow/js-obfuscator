/**
 * AST manipulation utilities
 */

import * as t from '@babel/types';

export class ASTUtils {
  /**
   * Check if node is a simple literal
   */
  static isSimpleLiteral(node: t.Node): boolean {
    return (
      t.isStringLiteral(node) ||
      t.isNumericLiteral(node) ||
      t.isBooleanLiteral(node) ||
      t.isNullLiteral(node)
    );
  }

  /**
   * Check if node is safe to evaluate at compile time
   */
  static isSafeToEvaluate(node: t.Node): boolean {
    if (this.isSimpleLiteral(node)) return true;
    if (t.isBinaryExpression(node)) {
      return this.isSafeToEvaluate(node.left) && this.isSafeToEvaluate(node.right);
    }
    if (t.isUnaryExpression(node)) {
      return this.isSafeToEvaluate(node.argument);
    }
    return false;
  }

  /**
   * Evaluate a safe expression
   */
  static evaluateExpression(node: t.Node): any {
    if (t.isStringLiteral(node)) return node.value;
    if (t.isNumericLiteral(node)) return node.value;
    if (t.isBooleanLiteral(node)) return node.value;
    if (t.isNullLiteral(node)) return null;

    if (t.isUnaryExpression(node)) {
      const arg = this.evaluateExpression(node.argument);
      switch (node.operator) {
        case '!':
          return !arg;
        case '-':
          return -arg;
        case '+':
          return +arg;
        case '~':
          return ~arg;
        default:
          return undefined;
      }
    }

    if (t.isBinaryExpression(node)) {
      const left = this.evaluateExpression(node.left);
      const right = this.evaluateExpression(node.right);

      switch (node.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          return left / right;
        case '%':
          return left % right;
        case '**':
          return left ** right;
        case '==':
          return left == right;
        case '===':
          return left === right;
        case '<':
          return left < right;
        case '>':
          return left > right;
        case '<=':
          return left <= right;
        case '>=':
          return left >= right;
        case '&':
          return left & right;
        case '|':
          return left | right;
        case '^':
          return left ^ right;
        default:
          return undefined;
      }
    }

    return undefined;
  }

  /**
   * Create a literal from a value
   */
  static createLiteral(value: any): t.Expression {
    if (typeof value === 'string') {
      return t.stringLiteral(value);
    }
    if (typeof value === 'number') {
      return t.numericLiteral(value);
    }
    if (typeof value === 'boolean') {
      return t.booleanLiteral(value);
    }
    if (value === null) {
      return t.nullLiteral();
    }
    return t.identifier('undefined');
  }

  /**
   * Clone a node
   */
  static cloneNode<T extends t.Node>(node: T): T {
    return JSON.parse(JSON.stringify(node)) as T;
  }

  /**
   * Wrap an expression in a self-executing function
   */
  static wrapInIIFE(expression: t.Expression): t.CallExpression {
    return t.callExpression(
      t.arrowFunctionExpression([], t.blockStatement([t.returnStatement(expression)])),
      []
    );
  }

  /**
   * Create a random obfuscated variable
   */
  static createObfuscatedVariable(name: string, init: t.Expression): t.VariableDeclaration {
    return t.variableDeclaration('var', [
      t.variableDeclarator(t.identifier(name), init),
    ]);
  }
}
