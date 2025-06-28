
import { Project, SyntaxKind, JsxElement } from 'ts-morph';
import { findJsxTag } from './utils/jsxUtils';

export function findFieldsInHiveForm(sourceCode: string): string[] {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      jsx: 4, // JsxEmit.ReactJSX
    },
  });

  const sourceFile = project.createSourceFile('temp.tsx', sourceCode);
  const fieldNames: string[] = [];

  const hiveFormElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement)
    .filter(element => {
        const openingElement = element.getOpeningElement();
        return openingElement.getTagNameNode().getText() === 'HiveForm';
    });

  hiveFormElements.forEach(hiveFormElement => {
    const fieldElements = findJsxTag(hiveFormElement, 'Field');
    fieldElements.forEach(fieldElement => {
      const nameAttribute = fieldElement.getAttribute('name');
      if (nameAttribute) {
        const nameValue = nameAttribute.getDescendantsOfKind(SyntaxKind.StringLiteral)[0]?.getLiteralValue();
        if (nameValue) {
          fieldNames.push(nameValue);
        }
      }
    });
  });

  return fieldNames;
}
