# Security & Safety Guidelines

## Important Disclaimer

⚠️ **Obfuscation ≠ Encryption**

Obfuscation makes code harder to read and reverse-engineer, but it is **not a security measure**. Determined attackers can still deobfuscate code. For truly sensitive operations, use proper backend implementation with server-side logic.

## When to Use Obfuscation

✅ **Appropriate Use Cases:**
- Protecting intellectual property in client-side code
- Reducing readability of business logic
- Adding a layer of obscurity to client code
- Deterring casual code inspection

❌ **Inappropriate Use Cases:**
- Protecting authentication credentials
- Securing cryptographic keys
- Hiding sensitive algorithms (should be server-side)
- Compliance-critical security measures

## Security Best Practices

### 1. Preserve Global APIs

Always preserve critical global functions and objects:

```json
{
  "preservedNames": [
    "console",
    "process",
    "global",
    "window",
    "document",
    "fetch",
    "XMLHttpRequest"
  ]
}
```

### 2. Don't Obfuscate APIs

Leave API endpoints and version numbers readable:

```typescript
const preservedNames = [
  'API_VERSION',
  'ENDPOINTS',
  'apiKey',    // Consider using backend proxies instead
];
```

### 3. Use Environment Variables

```typescript
// ❌ Bad: Credentials in code
const apiKey = 'sk-1234567890';

// ✅ Good: Use environment variables
const apiKey = process.env.API_KEY;
```

### 4. Server-Side Sensitive Logic

```typescript
// ❌ Bad: Authentication in client code
function authenticateUser(password) {
  return hash(password) === storedHash;
}

// ✅ Good: Authentication on server
function loginUser(email, password) {
  return fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}
```

## Testing After Obfuscation

Always thoroughly test obfuscated code:

```bash
# 1. Unit tests
npm test

# 2. Integration tests
npm run test:integration

# 3. Manual testing
# - Test all features
# - Check edge cases
# - Verify performance

# 4. Production testing
# - Stage in QA environment
# - Monitor for errors
# - Test in target browsers/environments
```

## Browser Compatibility

Obfuscation may introduce code that breaks in older browsers. Test on your target browsers:

```json
{
  "preservedNames": [
    "Object.assign",
    "Promise",
    "Array.from"
  ]
}
```

## Performance Impact

Be aware of performance implications:

- **String encoding**: Adds runtime decoding overhead
- **Control flow flattening**: May impact performance
- **Dead code injection**: Increases bundle size
- **Complex transformations**: Slower startup time

### Optimization Tips

```json
{
  "preset": "low",
  "encodeStrings": false,
  "controlFlowFlattening": false,
  "deadCodeInjection": false
}
```

## Source Maps

For production debugging, use source maps:

```json
{
  "sourceMap": true
}
```

Store source maps separately and securely:
- Don't ship source maps to clients
- Use separate CDN with restricted access
- Implement authentication for source map access

## Compliance & Legal

- **License compliance**: Respect open-source licenses
- **User privacy**: Don't obfuscate code that processes user data
- **Terms of service**: Check if obfuscation violates terms
- **Accessibility**: Obfuscation shouldn't break accessibility features

## Known Limitations

### Dynamic Code

```javascript
// ❌ Cannot be obfuscated
eval('some code');
new Function('return ' + value);
```

### Reflection

```javascript
// ⚠️ May break if names are obfuscated
const methodName = 'processData';
obj[methodName]();  // Use preservedNames
```

### Third-party Libraries

```javascript
// ✅ Don't obfuscate dependencies
// Only obfuscate your application code
```

## Monitoring & Errors

Implement error tracking:

```typescript
// Log obfuscated stack traces
window.onerror = (msg, url, line, col, error) => {
  // Send to error tracking service
  captureException(error);
};
```

## Deobfuscation Protection

- Monitor for deobfuscation tools being used on your code
- Use anti-tampering techniques
- Implement integrity checks
- Consider code signing

## Incident Response

If your obfuscated code is deobfuscated:

1. **Assess the damage**
   - What code was exposed?
   - What secrets were revealed?

2. **Rotate credentials**
   - Change API keys
   - Invalidate tokens
   - Update secrets

3. **Update the code**
   - Fix exposed vulnerabilities
   - Implement server-side alternatives

4. **Communicate**
   - Notify affected users
   - Document the incident

## Additional Resources

- [OWASP - Code Obfuscation](https://owasp.org/www-community/attacks/Code_Injection)
- [CWE - Code Obfuscation](https://cwe.mitre.org/data/definitions/656.html)
- [MDN - Security](https://developer.mozilla.org/en-US/docs/Web/Security)

## Support

For security concerns, please email security@example.com (don't use public issues).
