import type React from 'react';

declare const Field: React.FC<{ name: string; context?: string; optional?: boolean }>;
declare const HiveForm: React.FC<{
  children: React.ReactNode;
  context?: string;
}>;

const NestedComponent = () => (
  <div>
    <Field name="nested.field" optional />
  </div>
);

const TestComponentForParser = () => {
  return (
    <>
      <HiveForm context="userProfile">
        <Field name="username" />
        <Field name="email" optional />
        <NestedComponent />
      </HiveForm>
      <HiveForm>
        <Field name="address" />
      </HiveForm>
      <HiveForm>
        <Field name="phoneNumber" optional />
      </HiveForm>
    </>
  );
};

export default TestComponentForParser;
