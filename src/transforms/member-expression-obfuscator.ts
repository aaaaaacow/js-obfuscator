/**
 * Transform: Obfuscate member expressions
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext } from '../types/index';

export class MemberExpressionObfuscator {
  /**
   * Apply member expression obfuscation to AST
   */
  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.memberExpressionObfuscation) return;

    traverse(ast, {
      MemberExpression: (path: any) => {
        const node = path.node as t.MemberExpression;

        // Convert obj.prop to obj['prop'] for dynamic property access
        if (!node.computed && t.isIdentifier(node.property)) {
          const propName = node.property.name;

          // Skip special properties
          if (['constructor', 'prototype', '__proto__'].includes(propName)) {
            return;
          }

          // Convert to computed property
          node.computed = true;
          node.property = t.stringLiteral(propName);
        }
      },
    });
  }
}
