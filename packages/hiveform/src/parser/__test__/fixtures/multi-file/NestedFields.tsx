import type React from 'react';

// These are dummy declarations for the sake of the parser test
declare const Field: React.FC<{ name: string }>;

export const NestedFields = () => {
  return (
    <div>
      <Field name="preferences" />
    </div>
  );
};
