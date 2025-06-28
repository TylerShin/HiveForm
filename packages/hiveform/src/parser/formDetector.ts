import { resolve } from 'node:path';
import {
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  Node,
  Project,
  type SourceFile,
  SyntaxKind,
} from 'ts-morph';

export interface HiveFormProviderInfo {
  filePath: string;
  startLine: number;
  endLine: number;
  elementName: string;
  props: Record<string, string>;
}

export interface DetectorOptions {
  /** 분석할 파일들의 glob 패턴 */
  include?: string[];
  /** 제외할 파일들의 glob 패턴 */
  exclude?: string[];
  /** 프로젝트 루트 경로 */
  rootPath?: string;
}

// Utils 함수들
function createProject(options: DetectorOptions): Project {
  const defaultOptions = {
    include: ['**/*.{ts,tsx,js,jsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
    rootPath: process.cwd(),
    ...options,
  };

  return new Project({
    tsConfigFilePath: resolve(defaultOptions.rootPath!, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
  });
}

function getTagName(element: JsxOpeningElement | JsxSelfClosingElement): string {
  const tagNameNode = element.getTagNameNode();
  return tagNameNode.getText();
}

function isHiveFormProvider(tagName: string): boolean {
  return tagName === 'HiveFormProvider' || tagName.endsWith('.HiveFormProvider');
}

function extractProps(element: JsxOpeningElement | JsxSelfClosingElement): Record<string, string> {
  const props: Record<string, string> = {};
  const attributes = element.getAttributes();

  for (const attr of attributes) {
    if (Node.isJsxAttribute(attr)) {
      const name = attr.getNameNode().getText();
      const initializer = attr.getInitializer();

      if (initializer) {
        // 문자열 리터럴인 경우
        if (Node.isStringLiteral(initializer)) {
          props[name] = initializer.getLiteralValue();
        }
        // JSX 표현식인 경우
        else if (Node.isJsxExpression(initializer)) {
          const expression = initializer.getExpression();
          if (expression) {
            props[name] = expression.getText();
          }
        }
        // 기타 경우
        else {
          props[name] = initializer.getText();
        }
      } else {
        // boolean attribute (예: disabled)
        props[name] = 'true';
      }
    }
  }

  return props;
}

function createProviderInfo(
  element: JsxOpeningElement | JsxSelfClosingElement,
  filePath: string
): HiveFormProviderInfo | null {
  try {
    const startPos = element.getStart();
    const endPos = element.getEnd();
    const sourceFile = element.getSourceFile();

    const startLineNumber = sourceFile.getLineAndColumnAtPos(startPos).line;
    const endLineNumber = sourceFile.getLineAndColumnAtPos(endPos).line;

    const props = extractProps(element);

    return {
      filePath,
      startLine: startLineNumber,
      endLine: endLineNumber,
      elementName: getTagName(element),
      props,
    };
  } catch (error) {
    console.warn(`Error creating provider info for ${filePath}:`, error);
    return null;
  }
}

function shouldExcludeFile(filePath: string, excludePatterns: string[]): boolean {
  return excludePatterns.some(pattern => {
    // 간단한 glob 패턴 매칭
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
}

function extractHiveFormProvidersFromSourceFile(sourceFile: SourceFile): HiveFormProviderInfo[] {
  const results: HiveFormProviderInfo[] = [];
  const filePath = sourceFile.getFilePath();

  // JSX 요소들을 찾습니다.
  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement);
  const jsxSelfClosingElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);

  // 일반 JSX 요소 처리 (<HiveFormProvider>...</HiveFormProvider>)
  for (const element of jsxElements) {
    const openingElement = element.getOpeningElement();
    const tagName = getTagName(openingElement);

    if (isHiveFormProvider(tagName)) {
      const info = createProviderInfo(openingElement, filePath);
      if (info) {
        results.push(info);
      }
    }
  }

  // 자체 닫힘 JSX 요소 처리 (<HiveFormProvider />)
  for (const element of jsxSelfClosingElements) {
    const tagName = getTagName(element);

    if (isHiveFormProvider(tagName)) {
      const info = createProviderInfo(element, filePath);
      if (info) {
        results.push(info);
      }
    }
  }

  return results;
}

// 메인 함수들
/**
 * 지정된 파일에서 HiveFormProvider를 찾습니다.
 */
export function detectHiveFormProvidersFromFile(
  filePath: string,
  options: DetectorOptions = {}
): HiveFormProviderInfo[] {
  const project = createProject(options);
  const sourceFile = project.addSourceFileAtPath(filePath);
  return extractHiveFormProvidersFromSourceFile(sourceFile);
}

/**
 * 프로젝트 전체에서 HiveFormProvider를 찾습니다.
 */
export function detectHiveFormProvidersFromProject(
  options: DetectorOptions = {}
): HiveFormProviderInfo[] {
  const defaultOptions = {
    include: ['**/*.{ts,tsx,js,jsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
    ...options,
  };

  const project = createProject(defaultOptions);
  const sourceFiles = project.addSourceFilesAtPaths(defaultOptions.include!);
  const results: HiveFormProviderInfo[] = [];

  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath();

    // 제외 패턴 확인
    if (shouldExcludeFile(filePath, defaultOptions.exclude!)) {
      continue;
    }

    const providers = extractHiveFormProvidersFromSourceFile(sourceFile);
    results.push(...providers);
  }

  return results;
}

/**
 * 특정 디렉토리에서 HiveFormProvider를 찾습니다.
 */
export function detectHiveFormProvidersFromDirectory(
  directoryPath: string,
  options: DetectorOptions = {}
): HiveFormProviderInfo[] {
  const defaultOptions = {
    rootPath: process.cwd(),
    ...options,
  };

  const resolvedPath = resolve(defaultOptions.rootPath!, directoryPath);
  const project = createProject(defaultOptions);
  const sourceFiles = project.addSourceFilesAtPaths(`${resolvedPath}/**/*.{ts,tsx,js,jsx}`);
  const results: HiveFormProviderInfo[] = [];

  for (const sourceFile of sourceFiles) {
    const providers = extractHiveFormProvidersFromSourceFile(sourceFile);
    results.push(...providers);
  }

  return results;
}
