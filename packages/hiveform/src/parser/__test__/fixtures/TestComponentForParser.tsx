import type React from 'react';

declare const Field: React.FC<{ name: string }>;
declare const HiveForm: React.FC<{
  children: React.ReactNode;
  context?: string;
}>;

const NestedComponent = () => (
  <div>
    <Field name="nested.field" />
  </div>
);

const TestComponentForParser = () => {
  return (
    <>
      <HiveForm context="userProfile">
        <Field name="username" />
        <Field name="email" />
        <NestedComponent />
      </HiveForm>
      <HiveForm>
        <Field name="address" />
      </HiveForm>
      <HiveForm>
        <Field name="phoneNumber" />
      </HiveForm>
    </>
  );
};

export default TestComponentForParser;
