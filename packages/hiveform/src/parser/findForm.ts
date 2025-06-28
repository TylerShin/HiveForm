import path from 'node:path';
import {
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  Node,
  Project,
  SyntaxKind,
} from 'ts-morph';

export interface FormInfo {
  filePath: string;
  context?: string;
  lineNumber: number;
  columnNumber: number;
}

export interface FindFormResult {
  forms: FormInfo[];
  totalCount: number;
}

/**
 * 프로젝트 내에서 HiveForm 컴포넌트를 사용하는 모든 곳을 찾고
 * 각 form의 context 값을 추출합니다.
 */
export function findForms(projectPath: string): FindFormResult {
  const project = new Project({
    tsConfigFilePath: path.join(projectPath, 'tsconfig.json'),
  });

  const forms: FormInfo[] = [];

  // 모든 소스 파일을 순회
  const sourceFiles = project.getSourceFiles(['**/*.tsx', '**/*.ts']);

  for (const sourceFile of sourceFiles) {
    // JSX 요소들을 찾기
    const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
    const jsxSelfClosingElements = sourceFile.getDescendantsOfKind(
      SyntaxKind.JsxSelfClosingElement
    );

    // Opening elements 처리 (<HiveForm>...</HiveForm>)
    for (const element of jsxElements) {
      const formInfo = extractFormInfo(element, sourceFile.getFilePath());
      if (formInfo) {
        forms.push(formInfo);
      }
    }

    // Self-closing elements 처리 (<HiveForm />)
    for (const element of jsxSelfClosingElements) {
      const formInfo = extractFormInfo(element, sourceFile.getFilePath());
      if (formInfo) {
        forms.push(formInfo);
      }
    }
  }

  return {
    forms,
    totalCount: forms.length,
  };
}

/**
 * JSX 요소에서 HiveForm 정보를 추출합니다.
 */
function extractFormInfo(
  element: JsxOpeningElement | JsxSelfClosingElement,
  filePath: string
): FormInfo | null {
  const tagName = element.getTagNameNode().getText();

  // HiveForm이 아닌 경우 무시
  if (tagName !== 'HiveForm') {
    return null;
  }

  const attributes = element.getAttributes();
  let context: string | undefined;

  // context 속성 찾기
  for (const attr of attributes) {
    if (Node.isJsxAttribute(attr)) {
      const name = attr.getNameNode().getText();
      if (name === 'context') {
        const initializer = attr.getInitializer();
        if (initializer) {
          // 문자열 리터럴인 경우
          if (Node.isStringLiteral(initializer)) {
            context = initializer.getLiteralValue();
          }
          // JSX 표현식인 경우 ({...})
          else if (Node.isJsxExpression(initializer)) {
            const expression = initializer.getExpression();
            if (expression && Node.isStringLiteral(expression)) {
              context = expression.getLiteralValue();
            } else if (expression) {
              // 변수나 다른 표현식인 경우 텍스트로 가져오기
              context = expression.getText();
            }
          }
        }
      }
    }
  }

  const start = element.getStart();
  const sourceFile = element.getSourceFile();
  const { line, column } = sourceFile.getLineAndColumnAtPos(start);

  return {
    filePath,
    context,
    lineNumber: line,
    columnNumber: column,
  };
}

/**
 * 특정 디렉토리에서 HiveForm을 찾습니다.
 */
export function findFormsInDirectory(directoryPath: string): FindFormResult {
  return findForms(directoryPath);
}

/**
 * 현재 프로젝트에서 HiveForm을 찾습니다.
 */
export function findFormsInCurrentProject(): FindFormResult {
  const currentDir = process.cwd();
  return findForms(currentDir);
}

/**
 * 찾은 Form 정보를 콘솔에 출력합니다.
 */
export function printFormResults(result: FindFormResult): void {
  console.log(`🔍 총 ${result.totalCount}개의 HiveForm을 찾았습니다.\n`);

  result.forms.forEach((form, index) => {
    console.log(`📋 Form #${index + 1}`);
    console.log(`   파일: ${form.filePath}`);
    console.log(`   위치: ${form.lineNumber}:${form.columnNumber}`);
    console.log(`   Context: ${form.context || '없음'}`);
    console.log('');
  });
}
