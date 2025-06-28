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

export function findFieldsInHiveForm(filePath: string): string[] {
  const project = new Project({
    compilerOptions: {
      jsx: 4, // JsxEmit.ReactJSX
    },
  });

  const sourceFile = project.addSourceFileAtPath(filePath);
  project.resolveSourceFileDependencies();

  const visitedComponents = new Set<string>();
  const fieldNames: string[] = [];

  const hiveFormElements = findJsxTagElements(sourceFile, 'HiveForm');

  for (const hiveFormElement of hiveFormElements) {
    fieldNames.push(...findFieldsRecursive(hiveFormElement, project, visitedComponents));
  }

  return [...new Set(fieldNames)];
}

export function generateTypeDefinition(interfaceName: string, fields: string[]): string {
  const properties = fields.map(field => `  ${field}: string;`).join('\n');
  return `export interface ${interfaceName} {\n${properties}\n}`;
}
