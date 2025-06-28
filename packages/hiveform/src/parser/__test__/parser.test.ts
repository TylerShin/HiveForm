import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { findFieldsInHiveForm, generateTypeDefinitions } from '../parser';

describe('parser', () => {
  it('should group fields by their HiveForm context', async () => {
    const filePath = path.resolve(__dirname, 'fixtures/TestComponentForParser.tsx');
    const forms = findFieldsInHiveForm(filePath);

    expect(forms).toHaveProperty('userProfile');
    expect(forms).toHaveProperty('HiveForm1');
    expect(forms).toHaveProperty('HiveForm2');
    expect(forms.userProfile).toEqual(
      expect.arrayContaining(['username', 'email', 'nested.field'])
    );
    expect(forms.HiveForm1).toEqual(['address']);
    expect(forms.HiveForm2).toEqual(['phoneNumber']);
  });

  it('should generate multiple TypeScript interface definitions from contexts', () => {
    const forms = {
      userProfile: ['username', 'email'],
      settings: ['theme', 'language'],
    };
    const expectedInterfaces =
      'export interface UserProfileForm {\n  username: string;\n  email: string;\n}\n\n' +
      'export interface SettingsForm {\n  theme: string;\n  language: string;\n}';
    const result = generateTypeDefinitions(forms);
    expect(result).toBe(expectedInterfaces);
  });

  it('should generate interfaces from a parsed component with contexts', async () => {
    const filePath = path.resolve(__dirname, 'fixtures/TestComponentForParser.tsx');
    const forms = findFieldsInHiveForm(filePath);
    const result = generateTypeDefinitions(forms);

    const expectedInterfaces =
      'export interface UserProfileForm {\n  username: string;\n  email: string;\n  nested.field: string;\n}\n\n' +
      'export interface HiveForm1Form {\n  address: string;\n}\n\n' +
      'export interface HiveForm2Form {\n  phoneNumber: string;\n}';
    expect(result).toBe(expectedInterfaces);
  });

  it('should find fields across multiple files with context', async () => {
    const rootFilePath = path.resolve(__dirname, 'fixtures/multi-file/RootComponent.tsx');
    const forms = findFieldsInHiveForm(rootFilePath);

    expect(forms).toHaveProperty('multiFileForm');
    expect(forms.multiFileForm).toHaveLength(5);
    expect(forms.multiFileForm).toEqual(
      expect.arrayContaining(['username', 'email', 'address', 'consent', 'preferences'])
    );
  });
});
