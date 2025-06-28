import type React from 'react';

// 임시 HiveFormProvider 정의
const HiveFormProvider: React.FC<{
  children?: React.ReactNode;
  context?: string;
}> = ({ children, context }) => {
  return <div data-context={context}>{children}</div>;
};

export function TestComponent1() {
  return (
    <div>
      <h1>첫 번째 테스트</h1>

      {/* 기본 HiveFormProvider */}
      <HiveFormProvider context="user-login">
        <input name="email" type="email" />
        <input name="password" type="password" />
      </HiveFormProvider>

      {/* 자체 닫힘 HiveFormProvider */}
      <HiveFormProvider context="quick-form" />
    </div>
  );
}
