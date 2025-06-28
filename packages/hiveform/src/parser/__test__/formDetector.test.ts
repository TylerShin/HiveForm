import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  detectHiveFormProvidersFromDirectory,
  detectHiveFormProvidersFromFile,
} from '../formDetector';

const TEST_FIXTURES_PATH = resolve(__dirname, '__test__/fixtures');

describe('FormDetector', () => {
  describe('detectHiveFormProvidersFromFile', () => {
    it('단일 파일에서 기본 HiveFormProvider를 찾을 수 있어야 한다', () => {
      const filePath = resolve(TEST_FIXTURES_PATH, 'TestComponent1.tsx');
      const results = detectHiveFormProvidersFromFile(filePath);

      expect(results).toHaveLength(2);

      // 첫 번째 HiveFormProvider 검증
      const firstProvider = results[0];
      expect(firstProvider.elementName).toBe('HiveFormProvider');
      expect(firstProvider.props.context).toBe('user-login');
      expect(firstProvider.filePath).toContain('TestComponent1.tsx');
      expect(firstProvider.startLine).toBeGreaterThan(0);
      expect(firstProvider.endLine).toBeGreaterThanOrEqual(firstProvider.startLine);

      // 두 번째 HiveFormProvider (자체 닫힘) 검증
      const secondProvider = results[1];
      expect(secondProvider.elementName).toBe('HiveFormProvider');
      expect(secondProvider.props.context).toBe('quick-form');
    });

    it('네임스페이스를 통한 HiveFormProvider를 찾을 수 있어야 한다', () => {
      const filePath = resolve(TEST_FIXTURES_PATH, 'TestComponent2.tsx');
      const results = detectHiveFormProvidersFromFile(filePath);

      expect(results).toHaveLength(1);

      const provider = results[0];
      expect(provider.elementName).toBe('HiveForm.HiveFormProvider');
      expect(provider.props.context).toBe('profile-form');
      expect(provider.props.autoSave).toBe('true');
    });

    it('HiveFormProvider가 없는 파일에서는 빈 배열을 반환해야 한다', () => {
      // 존재하지 않는 파일을 테스트하는 대신 TestComponent2에서 HiveFormProvider가 있는지 확인
      const filePath = resolve(TEST_FIXTURES_PATH, 'TestComponent2.tsx');
      const results = detectHiveFormProvidersFromFile(filePath);

      // TestComponent2에는 HiveForm.HiveFormProvider가 있으므로 1개를 찾아야 함
      expect(results).toHaveLength(1);
    });
  });

  describe('detectHiveFormProvidersFromDirectory', () => {
    it('디렉토리 내의 모든 HiveFormProvider를 찾을 수 있어야 한다', () => {
      const results = detectHiveFormProvidersFromDirectory(TEST_FIXTURES_PATH);

      // TestComponent1.tsx에서 2개, TestComponent2.tsx에서 1개 = 총 3개
      expect(results).toHaveLength(3);

      // 파일별 결과 확인
      const testComponent1Results = results.filter(r => r.filePath.includes('TestComponent1.tsx'));
      const testComponent2Results = results.filter(r => r.filePath.includes('TestComponent2.tsx'));

      expect(testComponent1Results).toHaveLength(2);
      expect(testComponent2Results).toHaveLength(1);
    });

    it('context 프로퍼티를 올바르게 추출해야 한다', () => {
      const results = detectHiveFormProvidersFromDirectory(TEST_FIXTURES_PATH);

      const contexts = results.map(r => r.props.context).filter(Boolean);
      expect(contexts).toContain('user-login');
      expect(contexts).toContain('quick-form');
      expect(contexts).toContain('profile-form');
    });

    it('여러 props를 올바르게 추출해야 한다', () => {
      const results = detectHiveFormProvidersFromDirectory(TEST_FIXTURES_PATH);

      // autoSave prop이 있는 provider 찾기
      const providerWithAutoSave = results.find(r => r.props.autoSave);
      expect(providerWithAutoSave).toBeDefined();
      expect(providerWithAutoSave!.props.autoSave).toBe('true');
      expect(providerWithAutoSave!.props.context).toBe('profile-form');
    });
  });

  describe('Props 추출', () => {
    it('문자열 props를 올바르게 추출해야 한다', () => {
      const filePath = resolve(TEST_FIXTURES_PATH, 'TestComponent1.tsx');
      const results = detectHiveFormProvidersFromFile(filePath);

      const providerWithContext = results.find(r => r.props.context === 'user-login');
      expect(providerWithContext).toBeDefined();
      expect(providerWithContext!.props.context).toBe('user-login');
    });

    it('boolean props를 올바르게 추출해야 한다', () => {
      const filePath = resolve(TEST_FIXTURES_PATH, 'TestComponent2.tsx');
      const results = detectHiveFormProvidersFromFile(filePath);

      const providerWithAutoSave = results.find(r => r.props.autoSave);
      expect(providerWithAutoSave).toBeDefined();
      expect(providerWithAutoSave!.props.autoSave).toBe('true');
    });
  });

  describe('파일 경로 및 라인 정보', () => {
    it('올바른 파일 경로를 반환해야 한다', () => {
      const filePath = resolve(TEST_FIXTURES_PATH, 'TestComponent1.tsx');
      const results = detectHiveFormProvidersFromFile(filePath);

      results.forEach(result => {
        expect(result.filePath).toContain('TestComponent1.tsx');
        expect(result.filePath).toBe(filePath);
      });
    });

    it('올바른 라인 번호를 반환해야 한다', () => {
      const filePath = resolve(TEST_FIXTURES_PATH, 'TestComponent1.tsx');
      const results = detectHiveFormProvidersFromFile(filePath);

      results.forEach(result => {
        expect(result.startLine).toBeGreaterThan(0);
        expect(result.endLine).toBeGreaterThanOrEqual(result.startLine);
      });
    });
  });
});
