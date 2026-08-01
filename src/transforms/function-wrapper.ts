/**
 * Transform: Wrap functions in self-executing closures
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext } from '../types/index';

export class FunctionWrapper {
  /**
   * Apply function wrapping to AST
   */
  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.functionWrapping) return;

    traverse(ast, {
      FunctionDeclaration: (path: any) => {
        this.wrapFunction(path, context);
      },
      FunctionExpression: (path: any) => {
        this.wrapFunction(path, context);
      },
      ArrowFunctionExpression: (path: any) => {
        this.wrapFunction(path, context);
      },
    });
  }

  /**
   * Wrap a function in a self-executing closure
   */
  private static wrapFunction(path: any, context: TransformContext): void {
    const node = path.node;

    // Only wrap if it's large enough to matter
    if (t.isFunctionDeclaration(node) || t.isFunctionExpression(node)) {
      if (!t.isBlockStatement(node.body)) return;

      const body = node.body as t.BlockStatement;
      if (body.body.length < 2) return; // Too small to wrap

      // Wrap the function body in a self-executing function
      const wrapper = t.callExpression(
        t.arrowFunctionExpression([], t.blockStatement(body.body)),
        []
      );

      const newBody = t.blockStatement([t.expressionStatement(wrapper)]);
      node.body = newBody;
    }
  }
}
