export interface ObfuscatorOptions {
  // Core Options
  renameIdentifiers?: boolean;
  encodeStrings?: boolean;
  removeComments?: boolean;
  compact?: boolean;

  // Advanced Options
  controlFlowFlattening?: boolean;
  deadCodeInjection?: boolean;
  functionWrapping?: boolean;
  memberExpressionObfuscation?: boolean;
  numberEncoding?: boolean;
  propertyKeyObfuscation?: boolean;
  evaluateExpressions?: boolean;

  // Configuration
  stringsEncoding?: 'base64' | 'hex' | 'unicode';
  preservedNames?: string[];
  sourceMap?: boolean;
  preset?: 'low' | 'medium' | 'high';
}

export interface ObfuscationResult {
  code: string;
  map?: SourceMap;
  stats: ObfuscationStats;
}

export interface ObfuscationStats {
  originalSize: number;
  obfuscatedSize: number;
  reduction: number;
  identifiersRenamed: number;
  stringsEncoded: number;
  executionTime: number;
}

export interface SourceMap {
  version: number;
  sources: string[];
  mappings: string;
  sourcesContent: string[];
}

export interface NameMap {
  [key: string]: string;
}

export interface TransformContext {
  options: ObfuscatorOptions;
  nameMap: NameMap;
  stringMap: NameMap;
  numberMap: NameMap;
  stats: ObfuscationStats;
  scopeStack: Scope[];
}

export interface Scope {
  type: 'global' | 'function' | 'block';
  parent: Scope | null;
  bindings: Set<string>;
  references: Map<string, number>;
}

export interface EncodedString {
  encoded: string;
  decoder: string;
  variable: string;
}
