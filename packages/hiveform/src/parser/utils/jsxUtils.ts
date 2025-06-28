
import { JsxElement, JsxOpeningElement, JsxSelfClosingElement, Node, SyntaxKind } from "ts-morph";

export function findJsxTag(node: Node, tagName: string): (JsxOpeningElement | JsxSelfClosingElement)[] {
  return node.getDescendants().filter(descendant => {
    if (descendant.getKind() === SyntaxKind.JsxOpeningElement || descendant.getKind() === SyntaxKind.JsxSelfClosingElement) {
      const jsxElement = descendant as JsxOpeningElement | JsxSelfClosingElement;
      if (jsxElement.getTagNameNode().getText() === tagName) {
        return true;
      }
    }
    return false;
  }) as (JsxOpeningElement | JsxSelfClosingElement)[];
}
