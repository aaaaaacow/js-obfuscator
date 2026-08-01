/**
 * Transform: Encode string literals
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext } from '../types/index';
import { StringEncoder } from '../utils/encoder';

export class StringEncoderTransform {
  /**
   * Apply string encoding to AST
   */
  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.encodeStrings) return;

    const encoding = context.options.stringsEncoding || 'base64';
    const MIN_LENGTH = 3; // Only encode strings longer than this

    traverse(ast, {
      StringLiteral(path: any) {
        const value = path.node.value;

        // Skip very short strings and strings that are used as keys
        if (value.length < MIN_LENGTH) return;
        if (path.parentPath.isMemberExpression() && path.parentPath.node.computed === false) {
          return;
        }

        // Encode the string
        let encoded: string;
        switch (encoding) {
          case 'hex':
            encoded = StringEncoder.toHex(value);
            break;
          case 'unicode':
            encoded = StringEncoder.toUnicode(value);
            break;
          case 'base64':
          default:
            encoded = StringEncoder.toBase64(value);
            break;
        }

        // Create decoder expression
        const decoderExpr = this.createDecoderExpression(encoded, encoding);

        path.replaceWith(decoderExpr);
        context.stats.stringsEncoded++;
      },
    });
  }

  /**
   * Create the appropriate decoder expression based on encoding type
   */
  private static createDecoderExpression(
    encoded: string,
    encoding: 'base64' | 'hex' | 'unicode'
  ): t.Expression {
    if (encoding === 'unicode') {
      return t.stringLiteral(encoded);
    }

    if (encoding === 'base64') {
      // Create: (function(){return Buffer.from('...','base64').toString()})()
      return t.callExpression(
        t.arrowFunctionExpression(
          [],
          t.callExpression(
            t.memberExpression(
              t.callExpression(
                t.memberExpression(t.identifier('Buffer'), t.identifier('from')),
                [t.stringLiteral(encoded), t.stringLiteral('base64')]
              ),
              t.identifier('toString')
            ),
            []
          )
        ),
        []
      );
    }

    if (encoding === 'hex') {
      return t.callExpression(
        t.arrowFunctionExpression(
          [],
          t.callExpression(
            t.memberExpression(
              t.callExpression(
                t.memberExpression(t.identifier('Buffer'), t.identifier('from')),
                [t.stringLiteral(encoded), t.stringLiteral('hex')]
              ),
              t.identifier('toString')
            ),
            []
          )
        ),
        []
      );
    }

    return t.stringLiteral(encoded);
  }
}
