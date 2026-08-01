/**
 * Transform: Remove all comments from code
 */

import * as t from '@babel/types';
import { TransformContext } from '../types/index';

export class CommentRemover {
  /**
   * Apply comment removal to AST
   */
  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.removeComments) return;

    // Traverse all nodes and clear comments
    traverse(ast, {
      enter(path: any) {
        // Remove all comment types
        if (path.node.leadingComments) {
          path.node.leadingComments = [];
        }
        if (path.node.trailingComments) {
          path.node.trailingComments = [];
        }
        if (path.node.innerComments) {
          path.node.innerComments = [];
        }
      },
    });

    // Clear comments from program node
    if (ast.comments) {
      ast.comments = [];
    }
  }
}

// Import traverse
import traverse from '@babel/traverse';
