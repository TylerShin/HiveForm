import { camelCase, pascalCase } from 'es-toolkit';

export type FieldInfo = {
  name: string;
  optional: boolean;
};

export function generateTypeDefinitions(forms: Record<string, FieldInfo[]>): string {
  let typeDefinitions = '';
  for (const context in forms) {
    const typeName = `${pascalCase(context)}Form`;
    const properties = forms[context]
      .map(field => `  ${field.name}${field.optional ? '?' : ''}: string;`)
      .join('\n');
    typeDefinitions += `export type ${typeName} = {\n${properties}\n};\n\n`;
  }
  return typeDefinitions.trim();
}

export function generateFormSchemas(forms: Record<string, FieldInfo[]>): string {
  let schemas = '';
  for (const context in forms) {
    const schemaName = `${camelCase(context)}Schema`;
    const properties = forms[context]
      .map(field => {
        const fieldName = field.name.includes('.') ? `'${field.name}'` : field.name;
        return `  ${fieldName}: z.string()${field.optional ? '.optional()' : ''}`;
      })
      .join(',\n');
    schemas += `export const ${schemaName} = z.object({\n${properties}\n});\n\n`;
  }
  return schemas.trim();
}

export function generateDefaultValues(forms: Record<string, FieldInfo[]>): string {
  let defaults = '';
  for (const context in forms) {
    const defaultName = `${camelCase(context)}DefaultValues`;
    const properties = forms[context]
      .map(field => {
        const fieldName = field.name.includes('.') ? `'${field.name}'` : field.name;
        return `  ${fieldName}: ''`;
      })
      .join(',\n');
    defaults += `export const ${defaultName} = {\n${properties}\n};\n\n`;
  }
  return defaults.trim();
}

export function generateFormConfigs(forms: Record<string, FieldInfo[]>): string {
  let configs = '';
  for (const context in forms) {
    const configName = `${camelCase(context)}Config`;
    const typeName = `${pascalCase(context)}Form`;
    const schemaName = `${camelCase(context)}Schema`;
    const defaultName = `${camelCase(context)}DefaultValues`;

    configs += `export const ${configName} = {
  type: {} as ${typeName},
  schema: ${schemaName},
  defaultValues: ${defaultName},
  fields: ${JSON.stringify(forms[context], null, 2)}
};\n\n`;
  }
  return configs.trim();
}

export function generateCompleteFormCode(forms: Record<string, FieldInfo[]>): string {
  const imports = `import { z } from 'zod';\n\n`;
  const types = generateTypeDefinitions(forms);
  const schemas = generateFormSchemas(forms);
  const defaults = generateDefaultValues(forms);
  const configs = generateFormConfigs(forms);

  return `${imports}${types}\n\n${schemas}\n\n${defaults}\n\n${configs}`;
}
