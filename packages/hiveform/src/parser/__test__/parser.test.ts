
import { promises as fs } from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { findFieldsInHiveForm } from '../parser';

describe('parser', () => {
  it('should find all Field components within HiveForm', async () => {
    const filePath = path.resolve(__dirname, 'fixtures/TestComponentForParser.tsx');
    const sourceCode = await fs.readFile(filePath, 'utf-8');
    
    const fieldNames = findFieldsInHiveForm(sourceCode);

    expect(fieldNames).toEqual(['username', 'email', 'nested.field', 'address']);
  });
});
