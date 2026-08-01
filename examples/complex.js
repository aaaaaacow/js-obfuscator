/**
 * Example 3: Complex Logic Obfuscation
 * Demonstrates control flow and expression evaluation
 */

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) {
      return false;
    }
  }

  return true;
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return quickSort(left).concat(middle, quickSort(right));
}

const numbers = [64, 34, 25, 12, 22, 11, 90, 88];
console.log('Original:', numbers);
console.log('Sorted:', quickSort(numbers));
console.log('Prime check (17):', isPrime(17));
console.log('Fibonacci(10):', fibonacci(10));
