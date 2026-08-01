# JS Obfuscator

🛡️ **Enterprise-grade JavaScript Obfuscator** - Transform and protect your code with advanced obfuscation techniques.

## Features

### Core Obfuscation
- ✅ **Variable/Function Renaming** - Scope-aware identifier transformation
- ✅ **String Encoding** - Base64, Hex, and custom string transformations
- ✅ **Comment Removal** - Strip all comments while preserving functionality
- ✅ **Whitespace Optimization** - Minimize file size
- ✅ **Constant Folding** - Evaluate constants at compile time

### Advanced Features
- ✅ **Control Flow Flattening** - Transform complex control structures
- ✅ **Dead Code Injection** - Add realistic dead code paths
- ✅ **Function Wrapping** - Wrap in self-executing closures
- ✅ **Member Expression Obfuscation** - Protect object property access
- ✅ **Number Encoding** - Transform numeric literals
- ✅ **Property Key Obfuscation** - Hide object keys
- ✅ **Expression Evaluation** - Pre-evaluate safe expressions

### Developer Experience
- 🎯 **TypeScript Support** - Fully typed codebase
- 🔧 **CLI Tool** - Command-line interface with flexible options
- ⚙️ **Configuration Files** - Support for `.obfuscatorrc.json`
- 📊 **Source Maps** - Debug obfuscated code
- 📚 **Comprehensive Docs** - Detailed documentation & examples
- ✅ **Unit Tests** - 90%+ code coverage
- 📈 **Performance Benchmarks** - Measure transformation speed

## Installation

```bash
npm install js-obfuscator
```

## Quick Start

### CLI Usage

```bash
# Basic obfuscation
obfuscate input.js -o output.js

# With configuration
obfuscate input.js -c .obfuscatorrc.json -o output.js

# Generate source map
obfuscate input.js -o output.js --sourceMap

# High security preset
obfuscate input.js -o output.js --preset high
```

### Programmatic Usage

```typescript
import { Obfuscator } from 'js-obfuscator';

const obfuscator = new Obfuscator({
  renameIdentifiers: true,
  encodeStrings: true,
  removeComments: true,
  controlFlowFlattening: true,
  deadCodeInjection: true,
});

const result = obfuscator.obfuscate(sourceCode);
console.log(result.code);
```

## Configuration

Create `.obfuscatorrc.json` in your project root:

```json
{
  "renameIdentifiers": true,
  "encodeStrings": true,
  "removeComments": true,
  "controlFlowFlattening": false,
  "deadCodeInjection": false,
  "stringsEncoding": "base64",
  "preservedNames": ["console", "process"],
  "sourceMap": true
}
```

## Presets

- **low** - Basic obfuscation (renaming, strings)
- **medium** - Standard protection (+ control flow)
- **high** - Maximum security (+ dead code, complex transforms)

## API Documentation

### `Obfuscator` Class

```typescript
interface ObfuscatorOptions {
  renameIdentifiers?: boolean;         // Default: true
  encodeStrings?: boolean;             // Default: true
  removeComments?: boolean;            // Default: true
  controlFlowFlattening?: boolean;     // Default: false
  deadCodeInjection?: boolean;         // Default: false
  functionWrapping?: boolean;          // Default: false
  stringsEncoding?: 'base64' | 'hex';  // Default: 'base64'
  preservedNames?: string[];           // Names to skip
  sourceMap?: boolean;                 // Default: false
  compact?: boolean;                   // Default: true
}

interface ObfuscationResult {
  code: string;           // Obfuscated code
  map?: SourceMap;        // Source map if enabled
  stats: ObfuscationStats;
}

interface ObfuscationStats {
  originalSize: number;
  obfuscatedSize: number;
  reduction: number;           // Percentage
  identifiersRenamed: number;
  stringsEncoded: number;
  executionTime: number;       // ms
}
```

## Examples

### Example 1: Basic Obfuscation

**Input:**
```javascript
function calculateSum(a, b) {
  // Calculate the sum of two numbers
  const result = a + b;
  return result;
}

console.log(calculateSum(5, 3));
```

**Output:**
```javascript
function a(b,c){const d=b+c;return d}console.log(a(5,3));
```

### Example 2: String Encoding

**Input:**
```javascript
const apiKey = 'secret-key-12345';
const endpoint = 'https://api.example.com';
```

**Output:**
```javascript
const a = atob('c2VjcmV0LWtleS0xMjM0NQ==');
const b = atob('aHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20=');
```

## Performance

Benchmark results on various file sizes:

| File Size | Time | Output Size | Reduction |
|-----------|------|-------------|----------|
| 10KB      | 12ms | 6.2KB      | 38%      |
| 100KB     | 95ms | 58KB       | 42%      |
| 500KB     | 450ms| 275KB      | 45%      |

## Limitations

- Dynamic code (`eval`, `Function`) cannot be obfuscated
- Reflection-based access requires `preservedNames` configuration
- Large control flow flattening may impact runtime performance

## Security Notes

Obfuscation ≠ Encryption. This tool makes code harder to read and reverse-engineer, but determined attackers can still deobfuscate it. For sensitive logic, use proper backend implementation.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## License

MIT © 2026 aaaaaacow

## Roadmap

- [ ] WebAssembly compilation targets
- [ ] AST visualization tools
- [ ] Browser-based IDE
- [ ] Plugin system for custom transforms
- [ ] AI-powered variable naming
- [ ] Performance profiling integration
