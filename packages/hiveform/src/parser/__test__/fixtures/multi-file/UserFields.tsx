import type React from 'react';
import { NestedFields } from './NestedFields';

// These are dummy declarations for the sake of the parser test
declare const Field: React.FC<{ name: string }>;

export const UserFields = () => {
  return (
    <>
      <Field name="username" />
      <Field name="email" />
      <NestedFields />
    </>
  );
};
