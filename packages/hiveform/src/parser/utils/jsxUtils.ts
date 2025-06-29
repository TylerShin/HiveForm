import {
  type Identifier,
  type JsxElement,
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  type Node,
  SyntaxKind,
} from 'ts-morph';

export function getTagNameNode(node: JsxElement | JsxSelfClosingElement) {
  if (node.isKind(SyntaxKind.JsxElement)) {
    return node.getOpeningElement().getTagNameNode();
  }
  return node.getTagNameNode();
}

export function findJsxTagElements(
  startNode: Node,
  tagName: string
): (JsxElement | JsxSelfClosingElement)[] {
  return startNode
    .getDescendants()
    .filter(
      (d): d is JsxElement | JsxSelfClosingElement =>
        d.isKind(SyntaxKind.JsxElement) || d.isKind(SyntaxKind.JsxSelfClosingElement)
    )
    .filter(element => getTagNameNode(element).getText() === tagName);
}

export function findCustomComponentTags(startNode: Node, exclude: string[] = []): Identifier[] {
  return startNode
    .getDescendants()
    .filter(
      (d): d is JsxElement | JsxSelfClosingElement =>
        d.isKind(SyntaxKind.JsxElement) || d.isKind(SyntaxKind.JsxSelfClosingElement)
    )
    .map(node => getTagNameNode(node))
    .filter(
      (tagName): tagName is Identifier =>
        tagName.isKind(SyntaxKind.Identifier) &&
        /^[A-Z]/.test(tagName.getText()) &&
        !exclude.includes(tagName.getText())
    );
}

export function getAttributeValue(
  element: JsxSelfClosingElement | JsxOpeningElement,
  attributeName: string
): string | undefined {
  const attribute = element.getAttribute(attributeName);
  if (attribute?.isKind(SyntaxKind.JsxAttribute)) {
    const initializer = attribute.getInitializer();
    if (!initializer) {
      // Boolean attribute without value (e.g., <Field optional />)
      return 'true';
    }
    return (
      initializer.asKind(SyntaxKind.StringLiteral)?.getLiteralValue() ||
      initializer.asKind(SyntaxKind.JsxExpression)?.getExpression()?.getText()
    );
  }
  return undefined;
}

export function findAncestorHiveForm(
  startNode: Node,
  targetContext?: string
): { element: JsxElement | JsxSelfClosingElement; context: string } | undefined {
  let current = startNode.getParent();

  while (current) {
    if (
      (current.isKind(SyntaxKind.JsxElement) || current.isKind(SyntaxKind.JsxSelfClosingElement)) &&
      getTagNameNode(current).getText() === 'HiveForm'
    ) {
      const contextAttr = getAttributeValue(
        current.isKind(SyntaxKind.JsxElement) ? current.getOpeningElement() : current,
        'context'
      );
      const context = contextAttr || 'anonymous';

      // If no target context specified, return the first HiveForm found
      if (!targetContext) {
        return { element: current, context };
      }

      // If target context specified, check if it matches
      if (contextAttr === targetContext) {
        return { element: current, context };
      }
    }

    current = current.getParent();
  }

  return undefined;
}
