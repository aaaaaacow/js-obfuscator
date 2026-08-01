# Configuration Guide

## Configuration File

Create a `.obfuscatorrc.json` file in your project root:

```json
{
  "preset": "medium",
  "renameIdentifiers": true,
  "encodeStrings": true,
  "removeComments": true,
  "controlFlowFlattening": true,
  "deadCodeInjection": false,
  "functionWrapping": true,
  "memberExpressionObfuscation": true,
  "numberEncoding": false,
  "stringsEncoding": "base64",
  "preservedNames": [
    "console",
    "process",
    "window",
    "document"
  ],
  "sourceMap": false,
  "compact": true
}
```

## CLI Usage

### Basic Obfuscation

```bash
obfuscate input.js -o output.js
```

### With Configuration File

```bash
obfuscate input.js -c .obfuscatorrc.json -o output.js
```

### Using Presets

```bash
# Low security (fast)
obfuscate input.js -o output.js --preset low

# Medium security (balanced)
obfuscate input.js -o output.js --preset medium

# High security (thorough)
obfuscate input.js -o output.js --preset high
```

### Individual Options

```bash
obfuscate input.js \
  --rename-identifiers \
  --encode-strings \
  --remove-comments \
  --control-flow-flattening \
  --dead-code-injection \
  --output output.js
```

### Generate Configuration File

```bash
obfuscate config --preset medium --output .obfuscatorrc.json
```

## Programmatic Usage

### Load Configuration from File

```typescript
import fs from 'fs';
import { Obfuscator } from 'js-obfuscator';

const configPath = '.obfuscatorrc.json';
const configContent = fs.readFileSync(configPath, 'utf-8');
const options = JSON.parse(configContent);

const obfuscator = new Obfuscator(options);
const result = obfuscator.obfuscate(sourceCode);
```

### Build Script Integration

```javascript
// build.js
const fs = require('fs');
const { Obfuscator } = require('js-obfuscator');

function obfuscateFiles(inputDir, outputDir) {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.js'));

  files.forEach(file => {
    const input = `${inputDir}/${file}`;
    const output = `${outputDir}/${file}`;
    const code = fs.readFileSync(input, 'utf-8');

    const obfuscator = new Obfuscator({ preset: 'medium' });
    const result = obfuscator.obfuscate(code);

    fs.writeFileSync(output, result.code, 'utf-8');
    console.log(`Obfuscated ${file}`);
  });
}

obfuscateFiles('src', 'dist');
```

### Package.json Integration

```json
{
  "scripts": {
    "obfuscate": "obfuscate src/index.js -c .obfuscatorrc.json -o dist/index.obfuscated.js",
    "build": "tsc && npm run obfuscate"
  }
}
```

## Environment-Specific Configuration

### Development Configuration

```json
{
  "preset": "low",
  "renameIdentifiers": false,
  "encodeStrings": false,
  "removeComments": false,
  "compact": false,
  "sourceMap": true
}
```

### Production Configuration

```json
{
  "preset": "high",
  "renameIdentifiers": true,
  "encodeStrings": true,
  "removeComments": true,
  "controlFlowFlattening": true,
  "deadCodeInjection": true,
  "compact": true,
  "sourceMap": false
}
```

## Preserving Identifiers

Use the `preservedNames` array to keep certain identifiers unchanged:

```json
{
  "preservedNames": [
    "console",
    "process",
    "window",
    "document",
    "React",
    "ReactDOM",
    "Vue",
    "Angular",
    "$",
    "_"
  ]
}
```

## Advanced Configuration

### Selective Encoding

```json
{
  "encodeStrings": true,
  "stringsEncoding": "base64",
  "numberEncoding": false,
  "memberExpressionObfuscation": true
}
```

### Minimal Output

```json
{
  "renameIdentifiers": true,
  "encodeStrings": false,
  "removeComments": true,
  "compact": true,
  "controlFlowFlattening": false,
  "deadCodeInjection": false
}
```

### Maximum Protection

```json
{
  "preset": "high",
  "controlFlowFlattening": true,
  "deadCodeInjection": true,
  "functionWrapping": true,
  "memberExpressionObfuscation": true,
  "numberEncoding": true,
  "propertyKeyObfuscation": true,
  "evaluateExpressions": true,
  "stringsEncoding": "base64",
  "compact": true
}
```
