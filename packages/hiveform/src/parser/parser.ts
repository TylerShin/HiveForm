import { pascalCase } from 'es-toolkit';
import { type Node, Project, SyntaxKind } from 'ts-morph';
import type { FieldInfo } from '../generator';
import { findJsxTagElements, getAttributeValue } from './utils/jsxUtils';

function processNodeWithContext(
  node: Node,
  currentContext: string | null,
  forms: Record<string, FieldInfo[]>,
  anonymousContextMap: Map<Node, string>,
  project: Project,
  visitedComponents: Set<string>
): void {
  let activeContext = currentContext;

  // Check if this node is a HiveForm - update context
  if (
    (node.isKind(SyntaxKind.JsxElement) || node.isKind(SyntaxKind.JsxSelfClosingElement)) &&
    node.getText().includes('HiveForm')
  ) {
    const contextAttr = getAttributeValue(
      node.isKind(SyntaxKind.JsxElement) ? node.getOpeningElement() : node,
      'context'
    );

    if (contextAttr) {
      activeContext = contextAttr;
    } else {
      activeContext = anonymousContextMap.get(node) || activeContext;
    }
  }

  // Check if this node is a Field - add to current context
  if (
    (node.isKind(SyntaxKind.JsxElement) || node.isKind(SyntaxKind.JsxSelfClosingElement)) &&
    node.getText().includes('Field')
  ) {
    const nameValue = getAttributeValue(
      node.isKind(SyntaxKind.JsxElement) ? node.getOpeningElement() : node,
      'name'
    );
    const fieldContext = getAttributeValue(
      node.isKind(SyntaxKind.JsxElement) ? node.getOpeningElement() : node,
      'context'
    );
    const optionalValue = getAttributeValue(
      node.isKind(SyntaxKind.JsxElement) ? node.getOpeningElement() : node,
      'optional'
    );

    if (nameValue) {
      let targetContext: string;

      if (fieldContext) {
        // Field has explicit context - use it
        targetContext = fieldContext;
      } else {
        // Field has no explicit context - use current context
        targetContext = activeContext || 'OrphanFields';
      }

      if (!forms[targetContext]) {
        forms[targetContext] = [];
      }

      const isOptional = optionalValue === 'true' || optionalValue === '{true}';
      forms[targetContext].push({ name: nameValue, optional: isOptional });
    }
  }

  // Check if this node is a custom component - expand it
  if (node.isKind(SyntaxKind.JsxElement) || node.isKind(SyntaxKind.JsxSelfClosingElement)) {
    const tagName = node.isKind(SyntaxKind.JsxElement)
      ? node.getOpeningElement().getTagNameNode().getText()
      : node.getTagNameNode().getText();

    if (/^[A-Z]/.test(tagName) && !['HiveForm', 'Field'].includes(tagName)) {
      // This is a custom component - find its definition
      const tagNameNode = node.isKind(SyntaxKind.JsxElement)
        ? node.getOpeningElement().getTagNameNode()
        : node.getTagNameNode();

      if (!visitedComponents.has(tagName) && tagNameNode.isKind(SyntaxKind.Identifier)) {
        visitedComponents.add(tagName);

        for (const definition of tagNameNode.getDefinitionNodes()) {
          processNodeWithContext(
            definition,
            activeContext,
            forms,
            anonymousContextMap,
            project,
            visitedComponents
          );
        }
      }
    }
  }

  // Process all children with the current context
  node.forEachChild(child => {
    processNodeWithContext(
      child,
      activeContext,
      forms,
      anonymousContextMap,
      project,
      visitedComponents
    );
  });
}

export function findFieldsInHiveForm(filePath: string): Record<string, FieldInfo[]> {
  const project = new Project({
    compilerOptions: {
      jsx: 4, // JsxEmit.ReactJSX
    },
  });

  const sourceFile = project.addSourceFileAtPath(filePath);
  project.resolveSourceFileDependencies();

  const forms: Record<string, FieldInfo[]> = {};
  let anonymousFormCounter = 1;
  const anonymousContextMap = new Map<Node, string>();

  // First, find all HiveForm elements and assign contexts to anonymous ones
  const hiveFormElements = findJsxTagElements(sourceFile, 'HiveForm');
  for (const hiveFormElement of hiveFormElements) {
    const contextAttr = getAttributeValue(
      hiveFormElement.isKind(SyntaxKind.JsxElement)
        ? hiveFormElement.getOpeningElement()
        : hiveFormElement,
      'context'
    );

    if (!contextAttr) {
      const anonymousContext = pascalCase(`hive-form-${anonymousFormCounter++}`);
      anonymousContextMap.set(hiveFormElement, anonymousContext);
    }
  }

  // Process the entire source file with context tracking
  processNodeWithContext(sourceFile, null, forms, anonymousContextMap, project, new Set<string>());

  // Deduplicate fields within each context
  for (const context in forms) {
    const uniqueFields = new Map<string, FieldInfo>();
    for (const field of forms[context]) {
      if (!uniqueFields.has(field.name)) {
        uniqueFields.set(field.name, field);
      } else {
        // If field exists, keep the one that's more permissive (optional if any is optional)
        const existing = uniqueFields.get(field.name)!;
        uniqueFields.set(field.name, {
          name: field.name,
          optional: existing.optional || field.optional,
        });
      }
    }
    forms[context] = Array.from(uniqueFields.values());
  }

  return forms;
}
