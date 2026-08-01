/**
 * State Machine Obfuscation
 * Converts linear control flow into opaque state machines
 * Makes code execution path extremely difficult to trace
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext } from '../types/index';

interface StateTransition {
  from: number;
  to: number;
  condition?: t.Expression;
  action?: t.Statement[];
}

export class StateMachineObfuscator {
  private stateCounter = 0;
  private transitions: StateTransition[] = [];
  private stateMap = new Map<string, number>();

  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.stateMachineObfuscation) return;

    const obfuscator = new StateMachineObfuscator();
    
    traverse(ast, {
      FunctionDeclaration(path) {
        obfuscator.transformFunction(path, context);
      },
      ArrowFunctionExpression(path) {
        obfuscator.transformFunction(path, context);
      },
      FunctionExpression(path) {
        obfuscator.transformFunction(path, context);
      },
    });
  }

  private transformFunction(path: any, context: TransformContext): void {
    if (!path.node.body || !t.isBlockStatement(path.node.body)) return;

    const statements = path.node.body.body;
    if (statements.length < 3) return; // Only transform longer functions

    // Build state machine from statements
    this.stateCounter = 0;
    this.transitions = [];
    this.stateMap.clear();

    statements.forEach((stmt, index) => {
      this.stateMap.set(`stmt_${index}`, this.stateCounter++);
    });

    // Build transitions between states
    statements.forEach((stmt, index) => {
      this.transitions.push({
        from: this.stateMap.get(`stmt_${index}`)!,
        to: index === statements.length - 1 ? -1 : this.stateMap.get(`stmt_${index + 1}`)!,
        action: [stmt],
      });
    });

    // Create state machine switch statement
    const stateMachineCode = this.generateStateMachine(path.node, context);
    
    if (t.isFunctionDeclaration(path.node)) {
      path.node.body.body = [stateMachineCode];
    } else if (t.isFunctionExpression(path.node) || t.isArrowFunctionExpression(path.node)) {
      path.node.body = t.blockStatement([stateMachineCode]);
    }
  }

  private generateStateMachine(func: any, context: TransformContext): t.Statement {
    const statements = func.body.body;
    const stateVar = t.identifier(`_state${Math.random().toString(36).slice(2)}`);
    const stateVarDecl = t.variableDeclaration('let', [
      t.variableDeclarator(stateVar, t.numericLiteral(0)),
    ]);

    // Generate switch cases for each state
    const switchCases: t.SwitchCase[] = [];
    
    statements.forEach((stmt, index) => {
      const caseLabel = this.stateMap.get(`stmt_${index}`)!;
      const nextState = index === statements.length - 1 ? -1 : this.stateMap.get(`stmt_${index + 1}`)!;

      const caseBody: t.Statement[] = [stmt];

      if (nextState !== -1) {
        caseBody.push(
          t.expressionStatement(
            t.assignmentExpression(
              '=',
              stateVar,
              t.numericLiteral(nextState)
            )
          )
        );
      } else {
        caseBody.push(t.breakStatement());
      }

      switchCases.push(
        t.switchCase(
          t.numericLiteral(caseLabel),
          caseBody
        )
      );
    });

    // Add default case
    switchCases.push(t.switchCase(null, [t.breakStatement()]));

    // Create while loop with state machine
    const whileLoop = t.whileStatement(
      t.binaryExpression('>=', stateVar, t.numericLiteral(0)),
      t.blockStatement([
        t.switchStatement(stateVar, switchCases),
      ])
    );

    return t.blockStatement([stateVarDecl, whileLoop]);
  }
}
