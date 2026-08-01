/**
 * Main Obfuscator class - orchestrates all transformations
 */

import * as t from '@babel/types';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';
import { ObfuscatorOptions, ObfuscationResult, ObfuscationStats, TransformContext } from './types/index';
import { IdentifierRenamer } from './transforms/identifier-renamer';
import { StringEncoderTransform } from './transforms/string-encoder';
import { CommentRemover } from './transforms/comment-remover';
import { ControlFlowFlattener } from './transforms/control-flow-flattener';
import { DeadCodeInjector } from './transforms/dead-code-injector';
import { FunctionWrapper } from './transforms/function-wrapper';
import { NumberEncoder } from './transforms/number-encoder';
import { MemberExpressionObfuscator } from './transforms/member-expression-obfuscator';
import { ExpressionEvaluator } from './transforms/expression-evaluator';

export class Obfuscator {
  private options: ObfuscatorOptions;

  constructor(options: ObfuscatorOptions = {}) {
    this.options = this.normalizeOptions(options);
  }

  /**
   * Normalize and apply presets to options
   */
  private normalizeOptions(options: ObfuscatorOptions): ObfuscatorOptions {
    const normalized = { ...options };

    // Apply preset if specified
    if (normalized.preset) {
      switch (normalized.preset) {
        case 'low':
          return {
            renameIdentifiers: true,
            encodeStrings: true,
            removeComments: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            functionWrapping: false,
            memberExpressionObfuscation: false,
            numberEncoding: false,
            propertyKeyObfuscation: false,
            evaluateExpressions: false,
            compact: true,
            ...options,
          };

        case 'medium':
          return {
            renameIdentifiers: true,
            encodeStrings: true,
            removeComments: true,
            controlFlowFlattening: true,
            deadCodeInjection: false,
            functionWrapping: true,
            memberExpressionObfuscation: true,
            numberEncoding: false,
            propertyKeyObfuscation: false,
            evaluateExpressions: true,
            compact: true,
            ...options,
          };

        case 'high':
          return {
            renameIdentifiers: true,
            encodeStrings: true,
            removeComments: true,
            controlFlowFlattening: true,
            deadCodeInjection: true,
            functionWrapping: true,
            memberExpressionObfuscation: true,
            numberEncoding: true,
            propertyKeyObfuscation: true,
            evaluateExpressions: true,
            compact: true,
            stringsEncoding: 'base64',
            ...options,
          };
      }
    }

    // Set defaults
    return {
      renameIdentifiers: normalized.renameIdentifiers !== false,
      encodeStrings: normalized.encodeStrings !== false,
      removeComments: normalized.removeComments !== false,
      compact: normalized.compact !== false,
      controlFlowFlattening: normalized.controlFlowFlattening === true,
      deadCodeInjection: normalized.deadCodeInjection === true,
      functionWrapping: normalized.functionWrapping === true,
      memberExpressionObfuscation: normalized.memberExpressionObfuscation === true,
      numberEncoding: normalized.numberEncoding === true,
      propertyKeyObfuscation: normalized.propertyKeyObfuscation === true,
      evaluateExpressions: normalized.evaluateExpressions === true,
      stringsEncoding: normalized.stringsEncoding || 'base64',
      preservedNames: normalized.preservedNames || [],
      sourceMap: normalized.sourceMap === true,
      ...normalized,
    };
  }

  /**
   * Main obfuscation method
   */
  obfuscate(code: string): ObfuscationResult {
    const startTime = performance.now();
    const originalSize = Buffer.byteLength(code, 'utf-8');

    try {
      // Parse the code
      const ast = parser.parse(code, {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
        plugins: [
          'jsx',
          'typescript',
          'decorators-legacy',
          'classProperties',
          'classPrivateProperties',
          'partialApplication',
          ['pipelineOperator', { proposal: 'minimal' }],
        ],
      });

      // Create transformation context
      const context: TransformContext = {
        options: this.options,
        nameMap: {},
        stringMap: {},
        numberMap: {},
        stats: {
          originalSize,
          obfuscatedSize: 0,
          reduction: 0,
          identifiersRenamed: 0,
          stringsEncoded: 0,
          executionTime: 0,
        },
        scopeStack: [],
      };

      // Apply transformations in order
      this.applyTransformations(ast, context);

      // Generate code
      const output = generate(ast, {
        compact: this.options.compact,
        minified: this.options.compact,
      });

      const obfuscatedCode = output.code;
      const obfuscatedSize = Buffer.byteLength(obfuscatedCode, 'utf-8');

      // Calculate statistics
      context.stats.obfuscatedSize = obfuscatedSize;
      context.stats.reduction = Math.round(((originalSize - obfuscatedSize) / originalSize) * 100);
      context.stats.executionTime = performance.now() - startTime;

      return {
        code: obfuscatedCode,
        stats: context.stats,
      };
    } catch (error) {
      throw new Error(`Obfuscation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Apply all enabled transformations
   */
  private applyTransformations(ast: t.Program, context: TransformContext): void {
    // Order matters! Apply transformations in a logical sequence

    // 1. Remove comments first
    CommentRemover.transform(ast, context);

    // 2. Evaluate expressions
    ExpressionEvaluator.transform(ast, context);

    // 3. Encode numbers
    NumberEncoder.transform(ast, context);

    // 4. Encode strings
    StringEncoderTransform.transform(ast, context);

    // 5. Obfuscate member expressions
    MemberExpressionObfuscator.transform(ast, context);

    // 6. Rename identifiers
    IdentifierRenamer.transform(ast, context);

    // 7. Flatten control flow
    ControlFlowFlattener.transform(ast, context);

    // 8. Wrap functions
    FunctionWrapper.transform(ast, context);

    // 9. Inject dead code
    DeadCodeInjector.transform(ast, context);
  }

  /**
   * Get the current options
   */
  getOptions(): ObfuscatorOptions {
    return { ...this.options };
  }
}

export default Obfuscator;
