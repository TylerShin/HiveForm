import { describe, expect, it } from 'vitest';
import {
  type FieldInfo,
  generateCompleteFormCode,
  generateDefaultValues,
  generateFormConfigs,
  generateFormSchemas,
  generateTypeDefinitions,
} from '../index';

describe('generator', () => {
  const mockForms: Record<string, FieldInfo[]> = {
    userProfile: [
      { name: 'username', optional: false },
      { name: 'email', optional: true },
      { name: 'nested.field', optional: true },
    ],
    settings: [
      { name: 'theme', optional: false },
      { name: 'language', optional: true },
    ],
  };

  it('should generate TypeScript type definitions', () => {
    const result = generateTypeDefinitions(mockForms);

    console.log('--- Generated TypeScript Type Definitions ---');
    console.log(result);
    console.log('--------------------------------------------');

    expect(result).toContain('export type UserProfileForm = {');
    expect(result).toContain('username: string;');
    expect(result).toContain('email?: string;');
    expect(result).toContain('nested.field?: string;');
    expect(result).toContain('export type SettingsForm = {');
    expect(result).toContain('theme: string;');
    expect(result).toContain('language?: string;');
  });

  it('should generate Zod schemas', () => {
    const result = generateFormSchemas(mockForms);

    console.log('--- Generated Zod Schemas ---');
    console.log(result);
    console.log('-----------------------------');

    expect(result).toContain('export const userProfileSchema = z.object({');
    expect(result).toContain('username: z.string()');
    expect(result).toContain('email: z.string().optional()');
    expect(result).toContain("'nested.field': z.string().optional()");
    expect(result).toContain('export const settingsSchema = z.object({');
    expect(result).toContain('theme: z.string()');
    expect(result).toContain('language: z.string().optional()');
  });

  it('should generate default values', () => {
    const result = generateDefaultValues(mockForms);

    console.log('--- Generated Default Values ---');
    console.log(result);
    console.log('--------------------------------');

    expect(result).toContain('export const userProfileDefaultValues = {');
    expect(result).toContain("username: ''");
    expect(result).toContain("email: ''");
    expect(result).toContain("'nested.field': ''");
    expect(result).toContain('export const settingsDefaultValues = {');
    expect(result).toContain("theme: ''");
    expect(result).toContain("language: ''");
  });

  it('should generate form configs', () => {
    const result = generateFormConfigs(mockForms);

    console.log('--- Generated Form Configs ---');
    console.log(result);
    console.log('------------------------------');

    expect(result).toContain('export const userProfileConfig = {');
    expect(result).toContain('type: {} as UserProfileForm,');
    expect(result).toContain('schema: userProfileSchema,');
    expect(result).toContain('defaultValues: userProfileDefaultValues,');
    expect(result).toContain('fields: [');
    expect(result).toContain('"name": "username"');
    expect(result).toContain('"optional": false');
  });

  it('should generate complete form code', () => {
    const result = generateCompleteFormCode(mockForms);

    console.log('--- Generated Complete Form Code ---');
    console.log(result);
    console.log('-----------------------------------');

    expect(result).toContain("import { z } from 'zod';");
    expect(result).toContain('export type UserProfileForm = {');
    expect(result).toContain('export const userProfileSchema = z.object({');
    expect(result).toContain('export const userProfileDefaultValues = {');
    expect(result).toContain('export const userProfileConfig = {');
  });

  it('should handle empty forms', () => {
    const emptyForms: Record<string, FieldInfo[]> = {};

    expect(generateTypeDefinitions(emptyForms)).toBe('');
    expect(generateFormSchemas(emptyForms)).toBe('');
    expect(generateDefaultValues(emptyForms)).toBe('');
    expect(generateFormConfigs(emptyForms)).toBe('');
  });

  it('should handle fields with special characters in names', () => {
    const specialForms: Record<string, FieldInfo[]> = {
      special: [
        { name: 'field-with-dash', optional: false },
        { name: 'field.with.dots', optional: true },
        { name: 'field_with_underscore', optional: false },
      ],
    };

    const typeResult = generateTypeDefinitions(specialForms);
    console.log('--- Generated Types for Special Characters ---');
    console.log(typeResult);
    console.log('---------------------------------------------');

    const schemaResult = generateFormSchemas(specialForms);
    console.log('--- Generated Schema for Special Characters ---');
    console.log(schemaResult);
    console.log('----------------------------------------------');

    expect(typeResult).toContain('field-with-dash: string;');
    expect(typeResult).toContain('field.with.dots?: string;');
    expect(typeResult).toContain('field_with_underscore: string;');

    expect(schemaResult).toContain("'field.with.dots': z.string().optional()");
    expect(schemaResult).toContain('field_with_underscore: z.string()');
  });
});
