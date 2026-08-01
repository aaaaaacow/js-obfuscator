#!/usr/bin/env node

/**
 * Benchmark script to measure obfuscation performance
 */

import fs from 'fs';
import path from 'path';
import { Obfuscator } from '../dist/index.js';

interface BenchmarkResult {
  name: string;
  preset: string;
  originalSize: number;
  obfuscatedSize: number;
  reduction: number;
  executionTime: number;
  throughput: number; // bytes per second
}

const results: BenchmarkResult[] = [];

function benchmark(filePath: string, presets: string[]): void {
  const fileName = path.basename(filePath);
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  const originalSize = Buffer.byteLength(sourceCode, 'utf-8');

  console.log(`\n📊 Benchmarking ${fileName} (${(originalSize / 1024).toFixed(2)} KB)`);
  console.log('━'.repeat(60));

  presets.forEach((preset) => {
    try {
      const obfuscator = new Obfuscator({ preset: preset as any });
      const result = obfuscator.obfuscate(sourceCode);

      const obfuscatedSize = Buffer.byteLength(result.code, 'utf-8');
      const throughput = originalSize / (result.stats.executionTime / 1000);

      const benchResult: BenchmarkResult = {
        name: fileName,
        preset,
        originalSize,
        obfuscatedSize,
        reduction: result.stats.reduction,
        executionTime: result.stats.executionTime,
        throughput,
      };

      results.push(benchResult);

      console.log(`\n${preset.toUpperCase()} Preset:`);
      console.log(`  ⏱️  Time:        ${result.stats.executionTime.toFixed(2)}ms`);
      console.log(`  📦 Original:    ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`  📦 Obfuscated:  ${(obfuscatedSize / 1024).toFixed(2)} KB`);
      console.log(`  📉 Reduction:   ${result.stats.reduction}%`);
      console.log(`  🚀 Throughput:  ${(throughput / 1024 / 1024).toFixed(2)} MB/s`);
    } catch (error) {
      console.error(`  ❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

function printSummary(): void {
  console.log('\n\n📈 BENCHMARK SUMMARY');
  console.log('═'.repeat(80));
  console.log(
    `${'File'.padEnd(25)} | ${'Preset'.padEnd(8)} | ${'Time (ms)'.padEnd(10)} | ${'Reduction'.padEnd(10)} | ${'Throughput'}`
  );
  console.log('─'.repeat(80));

  results.forEach((r) => {
    console.log(
      `${r.name.padEnd(25)} | ${r.preset.padEnd(8)} | ${r.executionTime.toFixed(2).padEnd(10)} | ${(r.reduction + '%').padEnd(10)} | ${(r.throughput / 1024 / 1024).toFixed(2)} MB/s`
    );
  });
}

// Run benchmarks
console.log('\n🚀 JS Obfuscator Benchmark Suite');
console.log('═'.repeat(60));

const examplesDir = path.join(path.dirname(new URL(import.meta.url).pathname), '../examples');
const presets = ['low', 'medium', 'high'];

if (fs.existsSync(examplesDir)) {
  fs.readdirSync(examplesDir)
    .filter((f) => f.endsWith('.js'))
    .forEach((file) => {
      benchmark(path.join(examplesDir, file), presets);
    });
}

printSummary();
console.log('\n✅ Benchmark complete!\n');
