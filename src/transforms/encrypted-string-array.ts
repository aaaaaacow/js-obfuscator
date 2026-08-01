/**
 * Encrypted String Array Obfuscation
 * Stores all strings in an encrypted array with computed indices
 * Makes string extraction nearly impossible
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext } from '../types/index';
import crypto from 'crypto';

interface StringInfo {
  value: string;
  index: number;
  hash: string;
}

export class EncryptedStringArrayObfuscator {
  private strings: StringInfo[] = [];
  private stringMap = new Map<string, number>();
  private encryptionKey: string;
  private arrayName: string;
  private decoderFunctionName: string;

  constructor() {
    this.encryptionKey = crypto.randomBytes(16).toString('hex');
    this.arrayName = `_s${Math.random().toString(36).slice(2)}`;
    this.decoderFunctionName = `_d${Math.random().toString(36).slice(2)}`;
  }

  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.encryptedStringArray) return;

    const obfuscator = new EncryptedStringArrayObfuscator();
    
    // First pass: collect all strings
    traverse(ast, {
      StringLiteral(path) {
        obfuscator.collectString(path.node.value);
      },
    });

    if (obfuscator.strings.length === 0) return;

    // Second pass: replace strings with decoder calls
    traverse(ast, {
      StringLiteral(path) {
        if (obfuscator.stringMap.has(path.node.value)) {
          const index = obfuscator.stringMap.get(path.node.value)!;
          const decoderCall = obfuscator.createDecoderCall(index);
          path.replaceWith(decoderCall);
        }
      },
    });

    // Add string array and decoder function to program
    const stringArrayDeclaration = obfuscator.createStringArrayDeclaration();
    const decoderFunction = obfuscator.createDecoderFunction();
    
    ast.program.body.unshift(stringArrayDeclaration, decoderFunction);
  }

  private collectString(value: string): void {
    if (this.stringMap.has(value)) return;
    
    const index = this.strings.length;
    const encrypted = this.encryptString(value);
    const hash = crypto.createHash('sha256').update(value).digest('hex');
    
    this.strings.push({
      value: encrypted,
      index,
      hash,
    });
    
    this.stringMap.set(value, index);
  }

  private encryptString(value: string): string {
    // Multi-layer encryption
    const buffer = Buffer.from(value);
    
    // Layer 1: XOR with key
    const xorred = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      xorred[i] = buffer[i] ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
    }
    
    // Layer 2: Base64
    const base64 = xorred.toString('base64');
    
    // Layer 3: Hex
    const hex = Buffer.from(base64).toString('hex');
    
    return hex;
  }

  private createDecoderCall(index: number): t.CallExpression {
    // Add random offset to index to avoid patterns
    const offset = Math.floor(Math.random() * 1000);
    const offsetIndex = index + offset;
    
    return t.callExpression(
      t.identifier(this.decoderFunctionName),
      [
        t.numericLiteral(offsetIndex),
        t.numericLiteral(offset),
      ]
    );
  }

  private createStringArrayDeclaration(): t.VariableDeclaration {
    const arrayElements = this.strings.map(str =>
      t.stringLiteral(str.value)
    );

    // Shuffle array to break patterns
    const shuffled = this.shuffleArray(arrayElements);

    return t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier(this.arrayName),
        t.arrayExpression(shuffled)
      ),
    ]);
  }

  private createDecoderFunction(): t.FunctionDeclaration {
    const paramOffset = t.identifier('_o');
    const paramIndex = t.identifier('_i');
    
    // Actual index = _i - _o
    const actualIndex = t.binaryExpression(
      '-',
      paramIndex,
      paramOffset
    );

    // Get encrypted string from array
    const encryptedStr = t.memberExpression(
      t.identifier(this.arrayName),
      actualIndex,
      true
    );

    // Decode: Hex → Base64 → XOR → String
    const hexToBase64 = t.callExpression(
      t.memberExpression(
        t.callExpression(
          t.memberExpression(
            t.identifier('Buffer'),
            t.identifier('from')
          ),
          [encryptedStr, t.stringLiteral('hex')]
        ),
        t.identifier('toString')
      ),
      []
    );

    // XOR decryption
    const buffer = t.identifier('_b');
    const xorLoop = t.forStatement(
      t.variableDeclaration('let', [t.variableDeclarator(t.identifier('_i'), t.numericLiteral(0))]),
      t.binaryExpression(
        '<',
        t.identifier('_i'),
        t.memberExpression(buffer, t.identifier('length'))
      ),
      t.updateExpression('++', t.identifier('_i')),
      t.blockStatement([
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(buffer, t.identifier('_i'), true),
            t.binaryExpression(
              '^',
              t.memberExpression(buffer, t.identifier('_i'), true),
              t.callExpression(
                t.memberExpression(
                  t.stringLiteral(this.encryptionKey),
                  t.identifier('charCodeAt')
                ),
                [
                  t.binaryExpression(
                    '%',
                    t.identifier('_i'),
                    t.numericLiteral(this.encryptionKey.length)
                  ),
                ]
              )
            )
          )
        ),
      ])
    );

    const body = t.blockStatement([
      t.variableDeclaration('const', [
        t.variableDeclarator(
          buffer,
          t.callExpression(
            t.memberExpression(
              t.identifier('Buffer'),
              t.identifier('from')
            ),
            [hexToBase64, t.stringLiteral('base64')]
          )
        ),
      ]),
      xorLoop,
      t.returnStatement(
        t.callExpression(
          t.memberExpression(buffer, t.identifier('toString')),
          []
        )
      ),
    ]);

    return t.functionDeclaration(
      t.identifier(this.decoderFunctionName),
      [paramIndex, paramOffset],
      body
    );
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
