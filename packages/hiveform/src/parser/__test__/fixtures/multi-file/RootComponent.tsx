import type React from 'react';
import { AddressFields } from './AddressFields';
import { UserFields } from './UserFields';

// These are dummy declarations for the sake of the parser test
declare const HiveForm: React.FC<{ children: React.ReactNode }>;
declare const Field: React.FC<{ name: string }>;

const RootComponent = () => {
  return (
    <HiveForm>
      <UserFields />
      <AddressFields />
      <Field name="consent" />
    </HiveForm>
  );
};

export default RootComponent;
