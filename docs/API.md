# API Documentation

## Table of Contents

1. [Obfuscator Class](#obfuscator-class)
2. [Options](#options)
3. [Results](#results)
4. [Transformations](#transformations)
5. [Examples](#examples)

## Obfuscator Class

### Constructor

```typescript
const obfuscator = new Obfuscator(options?: ObfuscatorOptions);
```

### Methods

#### `obfuscate(code: string): ObfuscationResult`

Obfuscates the provided JavaScript code and returns the result with statistics.

```typescript
const result = obfuscator.obfuscate(sourceCode);
console.log(result.code);        // Obfuscated code
console.log(result.stats);       // Statistics
```

#### `getOptions(): ObfuscatorOptions`

Returns the current configuration options.

```typescript
const options = obfuscator.getOptions();
```

## Options

### ObfuscatorOptions Interface

```typescript
interface ObfuscatorOptions {
  // Core Transformations
  renameIdentifiers?: boolean;           // Default: true
  encodeStrings?: boolean;               // Default: true
  removeComments?: boolean;              // Default: true
  compact?: boolean;                     // Default: true

  // Advanced Transformations
  controlFlowFlattening?: boolean;       // Default: false
  deadCodeInjection?: boolean;           // Default: false
  functionWrapping?: boolean;            // Default: false
  memberExpressionObfuscation?: boolean; // Default: false
  numberEncoding?: boolean;              // Default: false
  propertyKeyObfuscation?: boolean;      // Default: false
  evaluateExpressions?: boolean;         // Default: false

  // Configuration
  stringsEncoding?: 'base64' | 'hex' | 'unicode'; // Default: 'base64'
  preservedNames?: string[];             // Names to skip renaming
  sourceMap?: boolean;                   // Default: false
  preset?: 'low' | 'medium' | 'high';   // Apply predefined preset
}
```

### Presets

#### `low` Preset

Basic obfuscation for minimal performance impact:

- ✅ Identifier renaming
- ✅ String encoding
- ✅ Comment removal
- ❌ Control flow flattening
- ❌ Dead code injection

```typescript
const obfuscator = new Obfuscator({ preset: 'low' });
```

#### `medium` Preset

Balanced obfuscation for standard protection:

- ✅ Identifier renaming
- ✅ String encoding
- ✅ Comment removal
- ✅ Control flow flattening
- ✅ Member expression obfuscation
- ✅ Function wrapping
- ✅ Expression evaluation

```typescript
const obfuscator = new Obfuscator({ preset: 'medium' });
```

#### `high` Preset

Aggressive obfuscation for maximum protection:

- ✅ All medium features
- ✅ Dead code injection
- ✅ Number encoding
- ✅ Property key obfuscation
- ✅ Maximum string encoding

```typescript
const obfuscator = new Obfuscator({ preset: 'high' });
```

## Results

### ObfuscationResult Interface

```typescript
interface ObfuscationResult {
  code: string;           // The obfuscated JavaScript code
  map?: SourceMap;        // Source map (if enabled)
  stats: ObfuscationStats;
}
```

### ObfuscationStats Interface

```typescript
interface ObfuscationStats {
  originalSize: number;      // Original code size in bytes
  obfuscatedSize: number;    // Obfuscated code size in bytes
  reduction: number;         // Size reduction percentage (0-100)
  identifiersRenamed: number; // Number of identifiers renamed
  stringsEncoded: number;    // Number of strings encoded
  executionTime: number;     // Obfuscation time in milliseconds
}
```

## Transformations

### 1. Identifier Renaming

Renames variables, functions, and parameters to short obfuscated names.

**Before:**
```javascript
function calculateSum(firstNumber, secondNumber) {
  const result = firstNumber + secondNumber;
  return result;
}
```

**After:**
```javascript
function a(b, c) {
  const d = b + c;
  return d;
}
```

### 2. String Encoding

Encodes string literals to prevent easy reading.

**Before:**
```javascript
const apiKey = 'sk-1234567890';
const apiUrl = 'https://api.example.com';
```

**After (Base64):**
```javascript
const a = (function(){return Buffer.from('c2stMTIzNDU2Nzg5MA==','base64').toString()})();
const b = (function(){return Buffer.from('aHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20=','base64').toString()})();
```

### 3. Comment Removal

Strips all single-line and multi-line comments.

**Before:**
```javascript
// Calculate the sum
function sum(a, b) {
  /* Add two numbers */
  return a + b; // Return result
}
```

**After:**
```javascript
function sum(a, b) {
  return a + b;
}
```

### 4. Control Flow Flattening

Transforms conditional and loop statements into flattened structures.

**Before:**
```javascript
if (x > 0) {
  console.log('positive');
} else {
  console.log('negative');
}
```

**After:**
```javascript
x > 0 ? (function() { console.log('positive'); })() : (function() { console.log('negative'); })();
```

### 5. Member Expression Obfuscation

Converts property access from dot notation to bracket notation.

**Before:**
```javascript
const config = user.profile.settings;
```

**After:**
```javascript
const a = b['c']['d']['e'];
```

### 6. Dead Code Injection

Injects non-executing code to increase obfuscation complexity.

**Injected Code:**
```javascript
var _0x1a2b3c = Math.random() * 1000;
if (false) {
  console.log('This never runs');
}
_false ? 1 : 2;
```

### 7. Function Wrapping

Wraps functions in self-executing closures.

**Before:**
```javascript
function process(data) {
  const result = transform(data);
  return result;
}
```

**After:**
```javascript
function a(b) {
  (function() {
    const c = d(b);
    return c;
  })();
}
```

### 8. Number Encoding

Encodes numeric literals as expressions.

**Before:**
```javascript
const value = 1000;
const timeout = 5000;
```

**After:**
```javascript
const a = 500 + 500;
const b = 2500 + 2500;
```

## Examples

### Example 1: Basic Usage

```typescript
import { Obfuscator } from 'js-obfuscator';

const code = `
  function hello(name) {
    console.log('Hello ' + name);
  }
  hello('World');
`;

const obfuscator = new Obfuscator();
const result = obfuscator.obfuscate(code);

console.log(result.code);
console.log(`Size reduction: ${result.stats.reduction}%`);
```

### Example 2: Custom Options

```typescript
const obfuscator = new Obfuscator({
  renameIdentifiers: true,
  encodeStrings: true,
  removeComments: true,
  controlFlowFlattening: true,
  deadCodeInjection: true,
  stringsEncoding: 'hex',
  preservedNames: ['console', 'process'],
  compact: true,
});

const result = obfuscator.obfuscate(sourceCode);
```

### Example 3: Protect API Keys

```typescript
const code = `
  const API_KEY = 'sk-1234567890abcdef';
  const API_URL = 'https://api.example.com';
  
  async function fetchData() {
    const response = await fetch(API_URL, {
      headers: { 'Authorization': 'Bearer ' + API_KEY }
    });
    return response.json();
  }
`;

const obfuscator = new Obfuscator({
  preset: 'high',
  encodeStrings: true,
  preservedNames: ['fetch', 'console'],
});

const result = obfuscator.obfuscate(code);
// API keys are now encoded and identifiers are renamed
```

### Example 4: Performance-Sensitive Code

```typescript
const obfuscator = new Obfuscator({
  preset: 'low',  // Minimal performance impact
  renameIdentifiers: true,
  encodeStrings: false,  // Skip string encoding for speed
  removeComments: true,
  controlFlowFlattening: false,
});

const result = obfuscator.obfuscate(performanceSensitiveCode);
```

## Error Handling

```typescript
try {
  const obfuscator = new Obfuscator();
  const result = obfuscator.obfuscate(code);
} catch (error) {
  if (error instanceof Error) {
    console.error('Obfuscation failed:', error.message);
    // Handle invalid JavaScript syntax
  }
}
```

## Performance Considerations

- **Large Files**: For files > 100KB, consider using the `low` preset
- **String Encoding**: Can add 20-30% overhead; disable if performance is critical
- **Control Flow Flattening**: Most expensive transformation; use sparingly
- **Dead Code Injection**: Increases file size by 5-15%

## Best Practices

1. **Always preserve global APIs**: Include common globals in `preservedNames`
2. **Test after obfuscation**: Ensure functionality is preserved
3. **Use appropriate presets**: Balance security vs. performance
4. **Enable source maps**: For easier debugging in production
5. **Avoid obfuscating dependencies**: Only obfuscate your application code
