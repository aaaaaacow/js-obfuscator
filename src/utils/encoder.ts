/**
 * String encoding utilities for obfuscation
 */

export class StringEncoder {
  /**
   * Encode string to base64
   */
  static toBase64(str: string): string {
    return Buffer.from(str).toString('base64');
  }

  /**
   * Decode base64 string
   */
  static fromBase64(encoded: string): string {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  }

  /**
   * Encode string to hexadecimal
   */
  static toHex(str: string): string {
    return Buffer.from(str).toString('hex');
  }

  /**
   * Decode hex string
   */
  static fromHex(encoded: string): string {
    return Buffer.from(encoded, 'hex').toString('utf-8');
  }

  /**
   * Encode string to unicode escape sequences
   */
  static toUnicode(str: string): string {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      result += '\\u' + ('0000' + code.toString(16)).slice(-4);
    }
    return result;
  }

  /**
   * Create a self-decoding string expression
   */
  static createDecoderExpression(encoded: string, type: 'base64' | 'hex' | 'unicode'): string {
    switch (type) {
      case 'base64':
        return `(function(){return Buffer.from('${encoded}','base64').toString()})()` || `atob('${encoded}')`;
      case 'hex':
        return `(function(){return Buffer.from('${encoded}','hex').toString()})()`;
      case 'unicode':
        return `'${encoded}'`;
      default:
        return `'${encoded}'`;
    }
  }

  /**
   * XOR encode string
   */
  static toXOR(str: string, key: number = 42): { encoded: string; key: number } {
    const chars: number[] = [];
    for (let i = 0; i < str.length; i++) {
      chars.push(str.charCodeAt(i) ^ key);
    }
    return {
      encoded: chars.map((c) => c.toString(16)).join(''),
      key,
    };
  }

  /**
   * Decode XOR encoded string
   */
  static fromXOR(encoded: string, key: number): string {
    const chars: string[] = [];
    for (let i = 0; i < encoded.length; i += 2) {
      const code = parseInt(encoded.substr(i, 2), 16) ^ key;
      chars.push(String.fromCharCode(code));
    }
    return chars.join('');
  }

  /**
   * Mix multiple encoding techniques
   */
  static mixEncodings(str: string): string {
    // Double base64 encoding for extra obfuscation
    const firstPass = this.toBase64(str);
    const secondPass = this.toBase64(firstPass);
    return `(function(){return Buffer.from(Buffer.from('${secondPass}','base64').toString(),'base64').toString()})()`;
  }
}
