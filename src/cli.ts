#!/usr/bin/env node

/**
 * CLI tool for JS Obfuscator
 */

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { Obfuscator } from './index';
import { ObfuscatorOptions } from './types/index';

const VERSION = '1.0.0';

program
  .version(VERSION)
  .description('🛡️ Enterprise-grade JavaScript Obfuscator');

program
  .command('obfuscate <input>')
  .description('Obfuscate a JavaScript file')
  .option('-o, --output <path>', 'Output file path')
  .option('-c, --config <path>', 'Configuration file path')
  .option('-p, --preset <level>', 'Preset level (low, medium, high)', 'medium')
  .option('--rename-identifiers', 'Enable identifier renaming', true)
  .option('--encode-strings', 'Enable string encoding', true)
  .option('--remove-comments', 'Enable comment removal', true)
  .option('--control-flow-flattening', 'Enable control flow flattening', false)
  .option('--dead-code-injection', 'Enable dead code injection', false)
  .option('--function-wrapping', 'Enable function wrapping', false)
  .option('--member-expression-obfuscation', 'Enable member expression obfuscation', false)
  .option('--number-encoding', 'Enable number encoding', false)
  .option('--source-map', 'Generate source map', false)
  .option('--compact', 'Compact output', true)
  .action((inputPath, options) => {
    try {
      // Load configuration file if provided
      let configOptions: ObfuscatorOptions = {};
      if (options.config) {
        const configPath = path.resolve(options.config);
        if (!fs.existsSync(configPath)) {
          console.error(chalk.red(`✗ Config file not found: ${configPath}`));
          process.exit(1);
        }
        const configContent = fs.readFileSync(configPath, 'utf-8');
        configOptions = JSON.parse(configContent);
      }

      // Read input file
      const resolvedInputPath = path.resolve(inputPath);
      if (!fs.existsSync(resolvedInputPath)) {
        console.error(chalk.red(`✗ Input file not found: ${resolvedInputPath}`));
        process.exit(1);
      }

      const sourceCode = fs.readFileSync(resolvedInputPath, 'utf-8');

      // Merge options
      const obfuscatorOptions: ObfuscatorOptions = {
        ...configOptions,
        preset: options.preset || (configOptions.preset || 'medium'),
        renameIdentifiers: options.renameIdentifiers !== false,
        encodeStrings: options.encodeStrings !== false,
        removeComments: options.removeComments !== false,
        controlFlowFlattening: options.controlFlowFlattening === true,
        deadCodeInjection: options.deadCodeInjection === true,
        functionWrapping: options.functionWrapping === true,
        memberExpressionObfuscation: options.memberExpressionObfuscation === true,
        numberEncoding: options.numberEncoding === true,
        sourceMap: options.sourceMap === true,
        compact: options.compact !== false,
      };

      // Create obfuscator and run
      const obfuscator = new Obfuscator(obfuscatorOptions);
      const result = obfuscator.obfuscate(sourceCode);

      // Determine output path
      const outputPath = options.output
        ? path.resolve(options.output)
        : inputPath.replace(/\.js$/, '.obfuscated.js');

      // Write output
      fs.writeFileSync(outputPath, result.code, 'utf-8');

      // Display statistics
      console.log(chalk.green('✓ Obfuscation complete!\n'));
      console.log(chalk.cyan('Statistics:'));
      console.log(`  Original size:     ${chalk.yellow(result.stats.originalSize + ' bytes')}`);
      console.log(`  Obfuscated size:   ${chalk.yellow(result.stats.obfuscatedSize + ' bytes')}`);
      console.log(`  Size reduction:    ${chalk.green(result.stats.reduction + '%')}`);
      console.log(`  Identifiers:       ${chalk.yellow(result.stats.identifiersRenamed + ' renamed')}`);
      console.log(`  Strings encoded:   ${chalk.yellow(result.stats.stringsEncoded + ' strings')}`);
      console.log(`  Execution time:    ${chalk.yellow(result.stats.executionTime.toFixed(2) + 'ms')}\n`);
      console.log(chalk.green(`Output: ${outputPath}`));
    } catch (error) {
      console.error(chalk.red(`✗ Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Generate a configuration file')
  .option('-o, --output <path>', 'Output file path', '.obfuscatorrc.json')
  .option('-p, --preset <level>', 'Preset level (low, medium, high)', 'medium')
  .action((options) => {
    const config: ObfuscatorOptions = {
      preset: options.preset as any,
    };

    const outputPath = path.resolve(options.output);
    fs.writeFileSync(outputPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(chalk.green(`✓ Configuration file created: ${outputPath}`));
  });

program
  .command('version')
  .description('Show version')
  .action(() => {
    console.log(`Version ${VERSION}`);
  });

if (process.argv.length < 3) {
  program.help();
}

program.parse(process.argv);
