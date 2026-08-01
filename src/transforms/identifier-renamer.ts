/**
 * Transform: Rename identifiers throughout the code
 */

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { TransformContext, NameMap } from '../types/index';
import { NameGenerator } from '../utils/naming';
import { ScopeAnalyzer } from '../utils/scope-analyzer';

export class IdentifierRenamer {
  /**
   * Apply identifier renaming to AST
   */
  static transform(ast: t.Program, context: TransformContext): void {
    if (!context.options.renameIdentifiers) return;

    const preservedNames = context.options.preservedNames || [];
    const nameGenerator = new NameGenerator(preservedNames);
    const scopeAnalyzer = new ScopeAnalyzer();
    const globalIdentifiers = scopeAnalyzer.getGlobalIdentifiers(ast);

    traverse(ast, {
      Scope: (path: any) => {
        // Handle each scope independently
        const scopeBindings = Object.keys(path.scope.bindings);

        scopeBindings.forEach((name) => {
          if (preservedNames.includes(name)) return;
          if (context.nameMap[name]) return; // Already renamed

          const binding = path.scope.bindings[name];
          const newName = nameGenerator.generateSimple();

          context.nameMap[name] = newName;
          context.stats.identifiersRenamed++;

          // Rename all references to this identifier
          binding.path.traverse({
            Identifier(idPath: any) {
              if (idPath.node.name === name && idPath.isReferencedIdentifier()) {
                idPath.node.name = newName;
              }
            },
          });

          // Rename the binding itself
          if (binding.kind === 'hoisted' || binding.kind === 'param') {
            binding.path.traverse({
              Identifier(idPath: any) {
                if (idPath.node.name === name) {
                  idPath.node.name = newName;
                }
              },
            });
          }
        });
      },
    });

    // Rename all remaining identifiers
    traverse(ast, {
      Identifier(path: any) {
        const { name } = path.node;

        if (preservedNames.includes(name)) return;
        if (context.nameMap[name]) {
          path.node.name = context.nameMap[name];
          return;
        }

        if (path.isDeclaration()) return;
        if (path.isReferencedIdentifier() || path.isBindingIdentifier()) {
          if (!context.nameMap[name]) {
            const newName = nameGenerator.generateSimple();
            context.nameMap[name] = newName;
            context.stats.identifiersRenamed++;
          }
          path.node.name = context.nameMap[name];
        }
      },
    });
  }
}
