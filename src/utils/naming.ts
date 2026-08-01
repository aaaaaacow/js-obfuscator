/**
 * Identifier naming utilities
 */

export class NameGenerator {
  private counter: number = 0;
  private usedNames: Set<string> = new Set();

  constructor(private preservedNames: string[] = []) {
    this.usedNames = new Set([
      ...preservedNames,
      // Global objects/functions that shouldn't be renamed
      'console',
      'process',
      'global',
      'window',
      'document',
      'Object',
      'Array',
      'String',
      'Number',
      'Boolean',
      'Function',
      'Error',
      'Math',
      'JSON',
      'Date',
      'Map',
      'Set',
      'Promise',
      'Symbol',
      'BigInt',
    ]);
  }

  /**
   * Generate a simple obfuscated name
   */
  generateSimple(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
    let name = '';

    let num = this.counter++;

    // Generate base name from counter
    do {
      name = letters[num % letters.length] + name;
      num = Math.floor(num / letters.length);
    } while (num > 0);

    // Ensure it's unique
    while (this.usedNames.has(name)) {
      name = this.generateSimple();
    }

    this.usedNames.add(name);
    return name;
  }

  /**
   * Generate a confusing obfuscated name (similar characters)
   */
  generateConfusing(): string {
    // Use confusing characters that look similar
    const similar = ['l', 'O', '0', 'I', '1', 'o'];
    let name = '_';

    for (let i = 0; i < 5; i++) {
      name += similar[Math.floor(Math.random() * similar.length)];
    }

    // Ensure it's unique
    let counter = 0;
    let finalName = name;
    while (this.usedNames.has(finalName) && counter < 100) {
      finalName = name + Math.random().toString(36).substr(2, 5);
      counter++;
    }

    this.usedNames.add(finalName);
    return finalName;
  }

  /**
   * Generate an encoded property name
   */
  generatePropertyKey(): string {
    return '_0x' + Math.random().toString(16).substr(2, 8);
  }

  /**
   * Check if name should be preserved
   */
  isPreserved(name: string): boolean {
    return this.usedNames.has(name);
  }

  /**
   * Reset the generator
   */
  reset(): void {
    this.counter = 0;
    this.usedNames = new Set(this.preservedNames);
  }
}
