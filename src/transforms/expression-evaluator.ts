/**
 * Transform: Evaluate safe expressions at compile time
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext } from '../types/index';
import { ASTUtils } from '../utils/ast-utils';

export class ExpressionEvaluator {
  /**
   * Apply expression evaluation to AST
   */
  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.evaluateExpressions) return;

    traverse(ast, {
      Expression: (path: any) => {
        const node = path.node;

        // Check if expression is safe to evaluate
        if (!ASTUtils.isSafeToEvaluate(node)) return;

        try {
          const result = ASTUtils.evaluateExpression(node);
          if (result !== undefined) {
            const literal = ASTUtils.createLiteral(result);
            path.replaceWith(literal);
          }
        } catch (e) {
          // Silently skip if evaluation fails
        }
      },
    });
  }
}
