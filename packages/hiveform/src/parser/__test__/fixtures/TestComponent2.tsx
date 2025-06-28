import type React from 'react';

// 네임스페이스를 통한 HiveFormProvider 사용 시뮬레이션
const HiveForm = {
  HiveFormProvider: ({
    children,
    context,
    autoSave,
  }: {
    children?: React.ReactNode;
    context?: string;
    autoSave?: boolean;
  }) => {
    return (
      <div data-context={context} data-auto-save={autoSave}>
        {children}
      </div>
    );
  },
};

export function TestComponent2() {
  return (
    <div>
      {/* 네임스페이스를 통한 사용 */}
      <HiveForm.HiveFormProvider context="profile-form" autoSave={true}>
        <input name="firstName" />
        <input name="lastName" />
      </HiveForm.HiveFormProvider>

      {/* HiveFormProvider가 없는 일반 컴포넌트 */}
      <form>
        <input name="regularInput" />
      </form>
    </div>
  );
}
