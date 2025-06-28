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
    return attribute.getInitializer()?.asKind(SyntaxKind.StringLiteral)?.getLiteralValue();
  }
  return undefined;
}
