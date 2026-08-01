/**
 * Transform: Inject dead code for obfuscation
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext } from '../types/index';

export class DeadCodeInjector {
  /**
   * Apply dead code injection to AST
   */
  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.deadCodeInjection) return;

    traverse(ast, {
      BlockStatement: (path: any) => {
        if (Math.random() > 0.7) {
          // 30% chance to inject dead code
          const deadCode = this.generateDeadCode();
          path.node.body.push(...deadCode);
        }
      },
    });
  }

  /**
   * Generate realistic-looking dead code
   */
  private static generateDeadCode(): t.Statement[] {
    const code: t.Statement[] = [];

    // Dead variable declarations
    const deadVar = t.variableDeclaration('var', [
      t.variableDeclarator(
        t.identifier('_0x' + Math.random().toString(16).substr(2, 8)),
        t.numericLiteral(Math.random() * 1000)
      ),
    ]);
    code.push(deadVar);

    // Dead if statement that never executes
    const deadIf = t.ifStatement(
      t.booleanLiteral(false),
      t.blockStatement([
        t.expressionStatement(
          t.callExpression(t.memberExpression(t.identifier('console'), t.identifier('log')), [
            t.stringLiteral('This will never run'),
          ])
        ),
      ])
    );
    code.push(deadIf);

    // Dead ternary operation
    const deadTernary = t.expressionStatement(
      t.conditionalExpression(
        t.booleanLiteral(false),
        t.numericLiteral(1),
        t.numericLiteral(2)
      )
    );
    code.push(deadTernary);

    return code;
  }
}
