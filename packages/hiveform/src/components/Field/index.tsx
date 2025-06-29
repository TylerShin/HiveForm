import type React from 'react';

export type Props = {
  name: string;
  context?: string;
  optional?: boolean;
};

export const Field: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  return <>{children}</>;
};
