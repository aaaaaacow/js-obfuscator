/**
 * Scope analysis for safe identifier renaming
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { Scope, NameMap } from '../types/index';

export class ScopeAnalyzer {
  private scopes: Map<t.Node, Scope> = new Map();
  private bindings: Map<string, Set<t.Node>> = new Map();
  private referenceCounts: Map<string, number> = new Map();

  /**
   * Analyze the AST for scopes and bindings
   */
  analyze(ast: t.Program, preservedNames: string[] = []): Map<string, Set<string>> {
    const result = new Map<string, Set<string>>();

    traverse(ast, {
      Scope: (path) => {
        const scopeBindings = new Set<string>();

        // Get all bindings in this scope
        Object.keys(path.scope.bindings).forEach((name) => {
          if (!preservedNames.includes(name)) {
            scopeBindings.add(name);
            this.recordReference(name);
          }
        });

        result.set(path.key as string, scopeBindings);
      },
    });

    return result;
  }

  /**
   * Record a reference to an identifier
   */
  private recordReference(name: string): void {
    const count = this.referenceCounts.get(name) || 0;
    this.referenceCounts.set(name, count + 1);
  }

  /**
   * Get identifiers sorted by frequency (more references = higher priority to rename)
   */
  getIdentifiersByFrequency(): string[] {
    return Array.from(this.referenceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }

  /**
   * Check if an identifier is safe to rename in this scope
   */
  isSafeToRename(name: string, path: any, preservedNames: string[]): boolean {
    if (preservedNames.includes(name)) return false;

    // Don't rename if it's referenced via dynamic property access
    const binding = path.scope.getBinding(name);
    if (!binding) return false;

    // Check if name is used with bracket notation
    let isDynamic = false;
    binding.referencePaths.forEach((refPath: any) => {
      if (refPath.isReferencedIdentifier()) {
        const parent = refPath.parentPath;
        if (parent.isMemberExpression() && parent.node.computed) {
          isDynamic = true;
        }
      }
    });

    return !isDynamic;
  }

  /**
   * Get all global identifiers
   */
  getGlobalIdentifiers(ast: t.Program): Set<string> {
    const globals = new Set<string>();

    traverse(ast, {
      Program(path) {
        Object.keys(path.scope.bindings).forEach((name) => {
          globals.add(name);
        });
      },
    });

    return globals;
  }

  /**
   * Get all identifiers in a given scope path
   */
  getScopeIdentifiers(path: any): Set<string> {
    const identifiers = new Set<string>();
    Object.keys(path.scope.bindings).forEach((name) => {
      identifiers.add(name);
    });
    return identifiers;
  }
}
