import type React from 'react';

// These are dummy declarations for the sake of the parser test
declare const HiveForm: React.FC<{ children: React.ReactNode; context?: string }>;
declare const Field: React.FC<{ name: string; context?: string }>;

const NestedHiveForm = () => {
  return (
    <HiveForm context="outerForm">
      <Field name="outerField1" />
      <Field name="outerField2" context="outerForm" />

      <HiveForm context="innerForm">
        <Field name="innerField1" />
        <Field name="innerField2" context="innerForm" />
        <Field name="fieldForOuter" context="outerForm" />
      </HiveForm>

      <HiveForm>
        <Field name="anonymousField" />
        <Field name="explicitOuter" context="outerForm" />
      </HiveForm>
    </HiveForm>
  );
};

export default NestedHiveForm;
