/**
 * Example 1: Basic Obfuscation
 * Demonstrates simple identifier renaming and comment removal
 */

function greet(name) {
  // This function greets a person
  const greeting = `Hello, ${name}!`;
  return greeting;
}

function calculateFactorial(n) {
  // Calculate factorial recursively
  if (n <= 1) return 1;
  return n * calculateFactorial(n - 1);
}

const result = greet('John');
console.log(result);
console.log(calculateFactorial(5));
