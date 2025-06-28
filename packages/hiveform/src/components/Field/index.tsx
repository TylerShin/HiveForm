
import React from 'react';

export interface FieldProps {
  name: string;
  // validator, etc. will be added later
}

export const Field: React.FC<FieldProps> = () => {
  return null; // This component is for static analysis and doesn't render anything itself.
};
