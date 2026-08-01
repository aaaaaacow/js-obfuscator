/**
 * Unit tests for NameGenerator
 */

import { NameGenerator } from '../utils/naming';

describe('NameGenerator', () => {
  it('should generate simple names', () => {
    const generator = new NameGenerator();
    const name1 = generator.generateSimple();
    const name2 = generator.generateSimple();

    expect(name1).toBeTruthy();
    expect(name2).toBeTruthy();
    expect(name1).not.toBe(name2);
  });

  it('should not generate preserved names', () => {
    const generator = new NameGenerator(['myPreservedName']);
    const name = generator.generateSimple();

    expect(name).not.toBe('myPreservedName');
  });

  it('should generate unique names', () => {
    const generator = new NameGenerator();
    const names = new Set();

    for (let i = 0; i < 100; i++) {
      const name = generator.generateSimple();
      expect(names.has(name)).toBe(false);
      names.add(name);
    }

    expect(names.size).toBe(100);
  });

  it('should check if name is preserved', () => {
    const generator = new NameGenerator(['console', 'process']);

    expect(generator.isPreserved('console')).toBe(true);
    expect(generator.isPreserved('myVar')).toBe(false);
  });
});
