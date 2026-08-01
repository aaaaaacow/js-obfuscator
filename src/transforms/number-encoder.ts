/**
 * Transform: Encode numeric literals
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext } from '../types/index';

export class NumberEncoder {
  /**
   * Apply number encoding to AST
   */
  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.numberEncoding) return;

    traverse(ast, {
      NumericLiteral: (path: any) => {
        const value = path.node.value;

        // Skip small numbers and special values
        if (Math.abs(value) < 10) return;
        if (!Number.isInteger(value)) return;

        // Encode number as expression: 100 -> (50 + 50)
        const encoded = this.encodeNumber(value);
        if (encoded) {
          path.replaceWith(encoded);
        }
      },
    });
  }

  /**
   * Encode a number as an expression
   */
  private static encodeNumber(value: number): t.Expression | null {
    // Simple strategy: split number into two parts
    const half = Math.floor(value / 2);
    const remainder = value - half;

    return t.binaryExpression(
      '+',
      t.numericLiteral(half),
      t.numericLiteral(remainder)
    );
  }
}
