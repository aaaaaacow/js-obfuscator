/**
 * Anti-Debugging & Runtime Protection
 * Detects and prevents debugging, tampering, and reverse engineering
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext } from '../types/index';

export class AntiDebuggingObfuscator {
  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.antiDebugging) return;

    const protectionCode = this.generateProtectionCode();
    ast.program.body.unshift(protectionCode);
  }

  private static generateProtectionCode(): t.Statement {
    // Generate unique function names to avoid detection
    const checkDebugger = `_checkDebugger${Math.random().toString(36).slice(2)}`;
    const checkTamper = `_checkTamper${Math.random().toString(36).slice(2)}`;
    const checkDevTools = `_checkDevTools${Math.random().toString(36).slice(2)}`;
    const checkExecution = `_checkExecution${Math.random().toString(36).slice(2)}`;

    const statements: t.Statement[] = [];

    // 1. Debugger detection via function constructor
    statements.push(
      t.functionDeclaration(
        t.identifier(checkDebugger),
        [],
        t.blockStatement([
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('_start'),
              t.callExpression(t.memberExpression(t.identifier('Date'), t.identifier('now')), [])
            ),
          ]),
          t.debuggerStatement(),
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('_end'),
              t.callExpression(t.memberExpression(t.identifier('Date'), t.identifier('now')), [])
            ),
          ]),
          t.ifStatement(
            t.binaryExpression(
              '>',
              t.binaryExpression('-', t.identifier('_end'), t.identifier('_start')),
              t.numericLiteral(100)
            ),
            t.blockStatement([
              t.throwStatement(
                t.newExpression(
                  t.identifier('Error'),
                  [t.stringLiteral('Debugger detected')]
                )
              ),
            ])
          ),
        ])
      )
    );

    // 2. DevTools detection
    statements.push(
      t.functionDeclaration(
        t.identifier(checkDevTools),
        [],
        t.blockStatement([
          t.variableDeclaration('let', [t.variableDeclarator(t.identifier('_devTools'), t.booleanLiteral(false))]),
          t.expressionStatement(
            t.assignmentExpression(
              '=',
              t.identifier('_devTools'),
              t.binaryExpression(
                '!=',
                t.unaryExpression(
                  'typeof',
                  t.memberExpression(
                    t.memberExpression(
                      t.identifier('window'),
                      t.identifier('__REACT_DEVTOOLS_GLOBAL_HOOK__')
                    ),
                    t.identifier('length')
                  )
                ),
                t.stringLiteral('undefined')
              )
            )
          ),
          t.ifStatement(
            t.identifier('_devTools'),
            t.blockStatement([
              t.throwStatement(
                t.newExpression(
                  t.identifier('Error'),
                  [t.stringLiteral('DevTools detected')]
                )
              ),
            ])
          ),
        ])
      )
    );

    // 3. Code tampering check via function string length
    statements.push(
      t.functionDeclaration(
        t.identifier(checkTamper),
        [],
        t.blockStatement([
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('_originalLength'),
              t.numericLiteral(Math.random() * 10000)
            ),
          ]),
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('_currentLength'),
              t.memberExpression(
                t.callExpression(t.identifier('arguments'), [t.numericLiteral(0)]),
                t.identifier('length')
              )
            ),
          ]),
          t.ifStatement(
            t.binaryExpression('!=', t.identifier('_currentLength'), t.identifier('_originalLength')),
            t.blockStatement([
              t.throwStatement(
                t.newExpression(
                  t.identifier('Error'),
                  [t.stringLiteral('Code integrity check failed')]
                )
              ),
            ])
          ),
        ])
      )
    );

    // 4. Execution time anomaly detection
    statements.push(
      t.functionDeclaration(
        t.identifier(checkExecution),
        [],
        t.blockStatement([
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('_executionTimes'),
              t.arrayExpression([])
            ),
          ]),
          t.forStatement(
            t.variableDeclaration('let', [t.variableDeclarator(t.identifier('_i'), t.numericLiteral(0))]),
            t.binaryExpression('<', t.identifier('_i'), t.numericLiteral(100)),
            t.updateExpression('++', t.identifier('_i')),
            t.blockStatement([
              t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier('_t1'),
                  t.callExpression(t.memberExpression(t.identifier('performance'), t.identifier('now')), [])
                ),
              ]),
              t.expressionStatement(
                t.assignmentExpression(
                  '=',
                  t.identifier('_x'),
                  t.numericLiteral(0)
                )
              ),
              t.forStatement(
                t.variableDeclaration('let', [t.variableDeclarator(t.identifier('_j'), t.numericLiteral(0))]),
                t.binaryExpression('<', t.identifier('_j'), t.numericLiteral(1000)),
                t.updateExpression('++', t.identifier('_j')),
                t.blockStatement([
                  t.expressionStatement(
                    t.assignmentExpression(
                      '=',
                      t.identifier('_x'),
                      t.binaryExpression('+', t.identifier('_x'), t.numericLiteral(1))
                    )
                  ),
                ])
              ),
              t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier('_t2'),
                  t.callExpression(t.memberExpression(t.identifier('performance'), t.identifier('now')), [])
                ),
              ]),
              t.expressionStatement(
                t.callExpression(
                  t.memberExpression(t.identifier('_executionTimes'), t.identifier('push')),
                  [t.binaryExpression('-', t.identifier('_t2'), t.identifier('_t1'))]
                )
              ),
            ])
          ),
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('_avg'),
              t.binaryExpression(
                '/',
                t.callExpression(
                  t.memberExpression(t.identifier('_executionTimes'), t.identifier('reduce')),
                  [
                    t.arrowFunctionExpression(
                      [t.identifier('a'), t.identifier('b')],
                      t.binaryExpression('+', t.identifier('a'), t.identifier('b'))
                    ),
                    t.numericLiteral(0),
                  ]
                ),
                t.memberExpression(t.identifier('_executionTimes'), t.identifier('length'))
              )
            ),
          ]),
          t.ifStatement(
            t.binaryExpression('>', t.identifier('_avg'), t.numericLiteral(50)),
            t.blockStatement([
              t.throwStatement(
                t.newExpression(
                  t.identifier('Error'),
                  [t.stringLiteral('Execution anomaly detected')]
                )
              ),
            ])
          ),
        ])
      )
    );

    // 5. Call all protection checks
    statements.push(
      t.tryStatement(
        t.blockStatement([
          t.expressionStatement(
            t.callExpression(t.identifier(checkDebugger), [])
          ),
          t.expressionStatement(
            t.callExpression(t.identifier(checkDevTools), [])
          ),
          t.expressionStatement(
            t.callExpression(t.identifier(checkTamper), [])
          ),
          t.expressionStatement(
            t.callExpression(t.identifier(checkExecution), [])
          ),
        ]),
        t.catchClause(
          t.identifier('_e'),
          t.blockStatement([
            t.expressionStatement(
              t.callExpression(
                t.memberExpression(t.identifier('console'), t.identifier('error')),
                [t.stringLiteral('Protection triggered'), t.identifier('_e')]
              )
            ),
            t.throwStatement(t.identifier('_e')),
          ])
        )
      )
    );

    return t.blockStatement(statements);
  }
}
