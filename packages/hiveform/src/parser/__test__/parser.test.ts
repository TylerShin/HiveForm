import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateCompleteFormCode, generateTypeDefinitions } from '../../generator';
import { findFieldsInHiveForm } from '../parser';

describe('parser', () => {
  it('should group fields by their HiveForm context with optional information', async () => {
    const filePath = path.resolve(__dirname, 'fixtures/TestComponentForParser.tsx');
    const forms = findFieldsInHiveForm(filePath);

    console.log('--- Current forms structure ---');
    console.log(JSON.stringify(forms, null, 2));
    console.log('------------------------------');

    expect(forms).toHaveProperty('userProfile');
    expect(forms).toHaveProperty('HiveForm1');
    expect(forms).toHaveProperty('HiveForm2');

    // Check userProfile fields
    const userProfileFields = forms.userProfile.map(f => f.name);
    expect(userProfileFields).toEqual(
      expect.arrayContaining(['username', 'email', 'nested.field'])
    );

    // Check optional properties
    const emailField = forms.userProfile.find(f => f.name === 'email');
    const usernameField = forms.userProfile.find(f => f.name === 'username');
    const nestedField = forms.userProfile.find(f => f.name === 'nested.field');

    expect(emailField?.optional).toBe(true);
    expect(usernameField?.optional).toBe(false);
    expect(nestedField?.optional).toBe(true);

    // Check other forms
    expect(forms.HiveForm1[0].name).toBe('address');
    expect(forms.HiveForm1[0].optional).toBe(false);
    expect(forms.HiveForm2[0].name).toBe('phoneNumber');
    expect(forms.HiveForm2[0].optional).toBe(true);
  });

  it('should generate multiple TypeScript type definitions from contexts', () => {
    const forms = {
      userProfile: [
        { name: 'username', optional: false },
        { name: 'email', optional: true },
      ],
      settings: [
        { name: 'theme', optional: false },
        { name: 'language', optional: true },
      ],
    };
    const expectedTypes =
      'export type UserProfileForm = {\n  username: string;\n  email?: string;\n};\n\n' +
      'export type SettingsForm = {\n  theme: string;\n  language?: string;\n};';
    const result = generateTypeDefinitions(forms);
    expect(result).toBe(expectedTypes);
  });

  it('should generate type definitions from a parsed component with contexts and optional fields', async () => {
    const filePath = path.resolve(__dirname, 'fixtures/TestComponentForParser.tsx');
    const forms = findFieldsInHiveForm(filePath);
    const result = generateTypeDefinitions(forms);

    console.log('--- Generated Type Definitions for TestComponentForParser.tsx ---');
    console.log(result);
    console.log('-------------------------------------------------------------------');

    // Filter out OrphanFields for the test comparison
    const filteredForms = { ...forms };
    delete filteredForms.OrphanFields;
    const filteredResult = generateTypeDefinitions(filteredForms);

    expect(filteredResult).toContain('export type UserProfileForm = {');
    expect(filteredResult).toContain('username: string;');
    expect(filteredResult).toContain('email?: string;');
    expect(filteredResult).toContain('nested.field?: string;');
    expect(filteredResult).toContain('export type HiveForm1Form = {');
    expect(filteredResult).toContain('address: string;');
    expect(filteredResult).toContain('export type HiveForm2Form = {');
    expect(filteredResult).toContain('phoneNumber?: string;');
  });

  it('should find fields across multiple files with context', async () => {
    const rootFilePath = path.resolve(__dirname, 'fixtures/multi-file/RootComponent.tsx');
    const forms = findFieldsInHiveForm(rootFilePath);

    expect(forms).toHaveProperty('multiFileForm');
    expect(forms.multiFileForm).toHaveLength(5);
    const fieldNames = forms.multiFileForm.map(f => f.name);
    expect(fieldNames).toEqual(
      expect.arrayContaining(['username', 'email', 'address', 'consent', 'preferences'])
    );
  });

  it('should handle nested HiveForm with Field context resolution', async () => {
    const filePath = path.resolve(__dirname, 'fixtures/NestedHiveForm.tsx');
    const forms = findFieldsInHiveForm(filePath);
    const result = generateTypeDefinitions(forms);

    console.log('--- Generated Type Definitions for NestedHiveForm.tsx ---');
    console.log(result);
    console.log('-------------------------------------------------------');

    // outerForm should contain: outerField1, outerField2, fieldForOuter, explicitOuter
    expect(forms).toHaveProperty('outerForm');
    const outerFormFieldNames = forms.outerForm.map(f => f.name);
    expect(outerFormFieldNames).toEqual(
      expect.arrayContaining(['outerField1', 'outerField2', 'fieldForOuter', 'explicitOuter'])
    );

    // innerForm should contain: innerField1, innerField2
    expect(forms).toHaveProperty('innerForm');
    const innerFormFieldNames = forms.innerForm.map(f => f.name);
    expect(innerFormFieldNames).toEqual(expect.arrayContaining(['innerField1', 'innerField2']));

    // Anonymous HiveForm should contain: anonymousField
    const anonymousFormKey = Object.keys(forms).find(
      key => key.startsWith('HiveForm') && forms[key].some(f => f.name === 'anonymousField')
    );
    expect(anonymousFormKey).toBeDefined();
    expect(forms[anonymousFormKey!][0].name).toBe('anonymousField');
  });

  it('should generate complete form implementation with parsed data', async () => {
    const filePath = path.resolve(__dirname, 'fixtures/TestComponentForParser.tsx');
    const forms = findFieldsInHiveForm(filePath);

    // Filter out OrphanFields for cleaner test
    const filteredForms = { ...forms };
    delete filteredForms.OrphanFields;

    const result = generateCompleteFormCode(filteredForms);

    console.log('--- Generated Complete Form Code ---');
    console.log(result);
    console.log('-----------------------------------');

    // Check that it includes all necessary parts
    expect(result).toContain("import { z } from 'zod';");
    expect(result).toContain('export type UserProfileForm = {');
    expect(result).toContain('export const userProfileSchema = z.object({');
    expect(result).toContain('export const userProfileDefaultValues = {');
    expect(result).toContain('export const userProfileConfig = {');

    // Check schema validation
    expect(result).toContain('username: z.string()');
    expect(result).toContain('email: z.string().optional()');

    // Check default values
    expect(result).toContain("username: ''");
    expect(result).toContain("email: ''");

    // Check config structure
    expect(result).toContain('type: {} as UserProfileForm,');
    expect(result).toContain('schema: userProfileSchema,');
    expect(result).toContain('defaultValues: userProfileDefaultValues,');
  });
});
