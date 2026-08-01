# Contributing to JS Obfuscator

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/js-obfuscator.git
   cd js-obfuscator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Development Workflow

### Running in Development Mode

```bash
npm run dev
```

This starts TypeScript in watch mode.

### Linting and Formatting

```bash
# Check code quality
npm run lint

# Auto-format code
npm run format
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Code Structure

```
src/
├── transforms/          # Transformation implementations
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── __tests__/          # Test files
├── index.ts            # Main Obfuscator class
└── cli.ts              # CLI implementation
```

## Adding a New Transformation

1. **Create transformation file** in `src/transforms/`
   ```typescript
   // src/transforms/my-transform.ts
   import * as t from '@babel/types';
   import traverse from '@babel/traverse';
   import { TransformContext } from '../types/index';

   export class MyTransform {
     static transform(ast: t.Program, context: TransformContext): void {
       if (!context.options.myOption) return;

       traverse(ast, {
         // Your transformation logic
       });
     }
   }
   ```

2. **Add option to types**
   ```typescript
   // src/types/index.ts
   export interface ObfuscatorOptions {
     myOption?: boolean;
   }
   ```

3. **Integrate into main class**
   ```typescript
   // src/index.ts
   import { MyTransform } from './transforms/my-transform';

   private applyTransformations(ast: t.Program, context: TransformContext): void {
     MyTransform.transform(ast, context);
   }
   ```

4. **Write tests**
   ```typescript
   // src/__tests__/my-transform.test.ts
   describe('MyTransform', () => {
     it('should do something', () => {
       // Test implementation
     });
   });
   ```

## Commit Guidelines

- Use clear, descriptive commit messages
- Reference issues when applicable: `Fix #123`
- Follow conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`

Examples:
```bash
git commit -m "feat: add new string encoding method"
git commit -m "fix: handle edge case in identifier renaming"
git commit -m "docs: update API documentation"
git commit -m "test: add tests for new transformation"
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** and commit regularly

3. **Push to your fork**
   ```bash
   git push origin feature/my-feature
   ```

4. **Create a Pull Request**
   - Provide a clear description of changes
   - Link related issues
   - Include any relevant test results

5. **Address review feedback**
   - Make requested changes
   - Push additional commits
   - Don't force push unless requested

## Testing Requirements

- Minimum 75% code coverage required
- All tests must pass
- New features must include tests
- Test files follow the `*.test.ts` naming convention

## Documentation

- Update relevant documentation files
- Include inline code comments for complex logic
- Add examples for new features
- Update CHANGELOG.md

## Code Style

- TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Max line length: 100 characters
- Use meaningful variable names

## Performance Considerations

- Avoid unnecessary iterations
- Consider memory usage for large files
- Profile new transformations
- Document performance implications

## Reporting Issues

Use GitHub Issues to report bugs. Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Version information
- Any relevant code samples

## Feature Requests

Suggestions for new features are welcome! Please:
- Describe the feature clearly
- Explain the use case
- Suggest implementation approach if possible

## Community

- Be respectful and inclusive
- Help others in issues and discussions
- Share your use cases and feedback
- Contribute to documentation and examples

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
