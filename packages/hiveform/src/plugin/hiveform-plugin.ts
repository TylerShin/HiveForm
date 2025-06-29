import fs from 'node:fs';
import path from 'node:path';
import type { RsbuildPlugin } from '@rsbuild/core';
import { glob } from 'glob';
import { generateCompleteFormCode } from '../generator';
import { findFieldsInHiveForm } from '../parser/parser';

interface HiveFormPluginOptions {
  /**
   * Source directories to scan for HiveForm usage
   * @default ['src']
   */
  sourceDirs?: string[];

  /**
   * File extensions to scan
   * @default ['tsx', 'jsx', 'ts', 'js']
   */
  extensions?: string[];

  /**
   * Output directory name for generated form files
   * @default 'form'
   */
  outputDir?: string;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

export const hiveFormPlugin = (options: HiveFormPluginOptions = {}): RsbuildPlugin => ({
  name: 'hiveform-plugin',
  setup(api) {
    const {
      sourceDirs = ['src'],
      extensions = ['tsx', 'jsx', 'ts', 'js'],
      outputDir = 'form',
      debug = false,
    } = options;

    const log = debug ? console.log : () => {};

    // Shared form generation logic
    const generateForms = async (isDev = false) => {
      const startTime = Date.now();
      log(`[HiveForm Plugin] ${isDev ? 'Dev mode' : 'Build mode'} - Starting form generation...`);

      // Get the current working directory (should be the app directory)
      const cwd = process.cwd();
      log(`[HiveForm Plugin] Working directory: ${cwd}`);

      // Create glob patterns for source files
      const patterns = sourceDirs.flatMap(dir => extensions.map(ext => `${dir}/**/*.${ext}`));

      // Exclude generated form files from scanning
      const excludePatterns = sourceDirs.map(dir => `!${dir}/${outputDir}/**/*`);
      const allPatterns = [...patterns, ...excludePatterns];

      log(`[HiveForm Plugin] Scanning patterns: ${allPatterns.join(', ')}`);

      // Find all source files
      const sourceFiles = await glob(allPatterns, { cwd });
      log(`[HiveForm Plugin] Found ${sourceFiles.length} source files`);

      // Track all forms found across files
      const allForms: Record<string, { fields: any[]; filePath: string }> = {};

      // Process each source file
      for (const sourceFile of sourceFiles) {
        try {
          const fullPath = path.resolve(cwd, sourceFile);
          log(`[HiveForm Plugin] Processing: ${sourceFile}`);

          // Use our parser to find HiveForm usage
          const forms = findFieldsInHiveForm(fullPath);

          if (Object.keys(forms).length > 0) {
            log(`[HiveForm Plugin] Found forms in ${sourceFile}:`, Object.keys(forms));

            // Store form info with file path
            for (const [context, fields] of Object.entries(forms)) {
              if (!allForms[context]) {
                allForms[context] = { fields: [], filePath: sourceFile };
              }

              // Merge fields (avoiding duplicates)
              const existingFieldNames = new Set(allForms[context].fields.map(f => f.name));
              for (const field of fields) {
                if (!existingFieldNames.has(field.name)) {
                  allForms[context].fields.push(field);
                }
              }
            }
          }
        } catch (error) {
          console.warn(`[HiveForm Plugin] Warning: Failed to process ${sourceFile}:`, error);
        }
      }

      // Generate form files for each context
      let generatedCount = 0;
      for (const [context, { fields, filePath }] of Object.entries(allForms)) {
        try {
          // Determine output directory (same directory as the source file)
          const sourceDir = path.dirname(filePath);
          const formDir = path.join(cwd, sourceDir, outputDir);

          // Ensure form directory exists
          if (!fs.existsSync(formDir)) {
            fs.mkdirSync(formDir, { recursive: true });
          }

          // Generate filename
          const filename =
            context === 'OrphanFields' || context.startsWith('HiveForm')
              ? 'index.tsx'
              : `${context.toLowerCase()}.tsx`;

          const outputPath = path.join(formDir, filename);

          // Generate form code
          const formCode = generateCompleteFormCode({ [context]: fields });

          // Check if file content has changed to avoid unnecessary writes
          let needsUpdate = true;
          if (fs.existsSync(outputPath)) {
            const existingContent = fs.readFileSync(outputPath, 'utf8');
            needsUpdate = existingContent !== formCode;
          }

          if (needsUpdate) {
            // Write generated file
            fs.writeFileSync(outputPath, formCode, 'utf8');
            generatedCount++;

            log(`[HiveForm Plugin] Generated form file: ${path.relative(cwd, outputPath)}`);
            console.log(
              `✅ HiveForm: ${isDev ? 'Updated' : 'Generated'} ${path.relative(cwd, outputPath)} (${fields.length} fields)`
            );
          } else {
            log(`[HiveForm Plugin] No changes needed for: ${path.relative(cwd, outputPath)}`);
          }
        } catch (error) {
          console.error(`[HiveForm Plugin] Error generating form for context "${context}":`, error);
        }
      }

      const duration = Date.now() - startTime;

      if (Object.keys(allForms).length === 0) {
        log('[HiveForm Plugin] No HiveForm usage found in source files');
      } else {
        const action = isDev ? 'Updated' : 'Generated';
        console.log(
          `🎯 HiveForm: ${action} ${Object.keys(allForms).length} form contexts (${generatedCount} files changed) in ${duration}ms`
        );
      }
    };

    // Build mode: Generate forms before build
    api.onBeforeBuild(async () => {
      await generateForms(false);
    });

    // Development mode: Generate forms after each compilation
    api.onDevCompileDone(async () => {
      try {
        await generateForms(true);
      } catch (error) {
        console.error('[HiveForm Plugin] Error in dev mode form generation:', error);
      }
    });
  },
});
