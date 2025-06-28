import { HiveForm } from '../../../components/HiveForm';

export function TestComponent1() {
  return (
    <div>
      <h1>첫 번째 테스트</h1>

      {/* 기본 HiveFormProvider */}
      <HiveForm context="user-login">
        <input name="email" type="email" />
        <input name="password" type="password" />
      </HiveForm>

      {/* 자체 닫힘 HiveFormProvider */}
      <HiveForm context="quick-form" />
    </div>
  );
}
