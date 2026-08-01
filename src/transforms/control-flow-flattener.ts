/**
 * Transform: Flatten control flow structures
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext } from '../types/index';

export class ControlFlowFlattener {
  /**
   * Apply control flow flattening to AST
   */
  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.controlFlowFlattening) return;

    traverse(ast, {
      IfStatement: (path: any) => {
        this.flattenIfStatement(path, context);
      },
      WhileStatement: (path: any) => {
        this.flattenWhileStatement(path, context);
      },
      ForStatement: (path: any) => {
        this.flattenForStatement(path, context);
      },
    });
  }

  /**
   * Flatten if-else statements into conditional expressions
   */
  private static flattenIfStatement(path: any, context: TransformContext): void {
    const node = path.node as t.IfStatement;

    // Convert simple if-else to ternary or switch-like structure
    if (node.consequent && !node.alternate) {
      // Simple if without else
      const guardedExpr = t.logicalExpression(
        '&&',
        node.test,
        t.callExpression(
          t.arrowFunctionExpression([], node.consequent as any),
          []
        )
      );

      path.replaceWith(t.expressionStatement(guardedExpr));
    } else if (node.consequent && node.alternate) {
      // If-else to conditional
      const condExpr = t.conditionalExpression(
        node.test,
        t.callExpression(
          t.arrowFunctionExpression([], node.consequent as any),
          []
        ),
        t.callExpression(
          t.arrowFunctionExpression([], node.alternate as any),
          []
        )
      );

      path.replaceWith(t.expressionStatement(condExpr));
    }
  }

  /**
   * Flatten while loops into for loops with break conditions
   */
  private static flattenWhileStatement(path: any, context: TransformContext): void {
    const node = path.node as t.WhileStatement;

    // Convert: while(cond) { body } -> for(;cond;) { body }
    const forLoop = t.forStatement(
      null,
      node.test,
      null,
      node.body
    );

    path.replaceWith(forLoop);
  }

  /**
   * Flatten for loops into while loops
   */
  private static flattenForStatement(path: any, context: TransformContext): void {
    const node = path.node as t.ForStatement;

    // Convert: for(init;test;update) { body } -> init; while(test) { body; update; }
    const statements = [];

    if (node.init) {
      if (t.isVariableDeclaration(node.init)) {
        statements.push(node.init);
      } else {
        statements.push(t.expressionStatement(node.init as t.Expression));
      }
    }

    const bodyStatements = t.isBlockStatement(node.body)
      ? node.body.body
      : [t.expressionStatement(node.body as t.Expression)];

    if (node.update) {
      bodyStatements.push(t.expressionStatement(node.update));
    }

    const whileLoop = t.whileStatement(
      node.test || t.booleanLiteral(true),
      t.blockStatement(bodyStatements)
    );

    statements.push(whileLoop);
    path.replaceWithMultiple(statements);
  }
}
