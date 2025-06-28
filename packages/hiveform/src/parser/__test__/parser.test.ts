import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { findFieldsInHiveForm, generateTypeDefinition } from '../parser';

describe('parser', () => {
  it('should find all Field components within HiveForm', async () => {
    const filePath = path.resolve(__dirname, 'fixtures/TestComponentForParser.tsx');
    const fieldNames = findFieldsInHiveForm(filePath);

    expect(fieldNames).toEqual(['username', 'email', 'nested.field', 'address']);
  });

  it('should generate a TypeScript interface definition from field names', () => {
    const fields = ['username', 'email', 'password'];
    const expectedInterface =
      'export interface UserForm {\n  username: string;\n  email: string;\n  password: string;\n}';
    const result = generateTypeDefinition('UserForm', fields);
    expect(result).toBe(expectedInterface);
  });

  it('should generate an interface from a parsed component', async () => {
    const filePath = path.resolve(__dirname, 'fixtures/TestComponentForParser.tsx');
    const fieldNames = findFieldsInHiveForm(filePath);
    const result = generateTypeDefinition('UserProfileForm', fieldNames);

    const expectedInterface =
      'export interface UserProfileForm {\n  username: string;\n  email: string;\n  nested.field: string;\n  address: string;\n}';
    expect(result).toBe(expectedInterface);
  });

  it('should find fields across multiple files from a root component', async () => {
    const rootFilePath = path.resolve(__dirname, 'fixtures/multi-file/RootComponent.tsx');
    const fieldNames = findFieldsInHiveForm(rootFilePath);

    expect(fieldNames).toHaveLength(4);
    expect(fieldNames).toEqual(expect.arrayContaining(['username', 'email', 'address', 'consent']));
  });
});
