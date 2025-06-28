import { pascalCase } from 'es-toolkit';
import { type Node, Project, SyntaxKind } from 'ts-morph';
import { findCustomComponentTags, findJsxTagElements, getAttributeValue } from './utils/jsxUtils';

function findFieldsRecursive(
  startNode: Node,
  project: Project,
  visitedComponents: Set<string>
): string[] {
  const fieldNames: string[] = [];

  const fieldElements = findJsxTagElements(startNode, 'Field');
  for (const fieldElement of fieldElements) {
    const nameValue = getAttributeValue(
      fieldElement.isKind(SyntaxKind.JsxElement) ? fieldElement.getOpeningElement() : fieldElement,
      'name'
    );
    if (nameValue) {
      fieldNames.push(nameValue);
    }
  }

  const customComponentTags = findCustomComponentTags(startNode, ['HiveForm', 'Field']);

  for (const tagName of customComponentTags) {
    const tagNameText = tagName.getText();
    if (visitedComponents.has(tagNameText)) {
      continue;
    }
    visitedComponents.add(tagNameText);

    for (const definition of tagName.getDefinitionNodes()) {
      fieldNames.push(...findFieldsRecursive(definition, project, visitedComponents));
    }
  }

  return fieldNames;
}

export function findFieldsInHiveForm(filePath: string): Record<string, string[]> {
  const project = new Project({
    compilerOptions: {
      jsx: 4, // JsxEmit.ReactJSX
    },
  });

  const sourceFile = project.addSourceFileAtPath(filePath);
  project.resolveSourceFileDependencies();

  const forms: Record<string, string[]> = {};
  let anonymousFormCounter = 1;

  const hiveFormElements = findJsxTagElements(sourceFile, 'HiveForm');

  for (const hiveFormElement of hiveFormElements) {
    const contextAttr = getAttributeValue(
      hiveFormElement.isKind(SyntaxKind.JsxElement)
        ? hiveFormElement.getOpeningElement()
        : hiveFormElement,
      'context'
    );
    const context = contextAttr || pascalCase(`hive-form-${anonymousFormCounter++}`);

    if (!forms[context]) {
      forms[context] = [];
    }
    const visitedComponents = new Set<string>();
    const fields = findFieldsRecursive(hiveFormElement, project, visitedComponents);
    forms[context].push(...fields);
  }

  // Deduplicate fields within each context
  for (const context in forms) {
    forms[context] = [...new Set(forms[context])];
  }

  return forms;
}

export function generateTypeDefinitions(forms: Record<string, string[]>): string {
  let typeDefinitions = '';
  for (const context in forms) {
    const interfaceName = `${pascalCase(context)}Form`;
    const properties = forms[context].map(field => `  ${field}: string;`).join('\n');
    typeDefinitions += `export interface ${interfaceName} {\n${properties}\n}\n\n`;
  }
  return typeDefinitions.trim();
}
