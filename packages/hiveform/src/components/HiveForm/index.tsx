import React from 'react';

type Props = {
  context?: string;
} & React.FormHTMLAttributes<HTMLFormElement>;

export const HiveForm = React.forwardRef<HTMLFormElement, Props>(
  ({ children, context, ...props }, ref) => {
    return (
      <form ref={ref} {...props}>
        {children}
      </form>
    );
  }
);

HiveForm.displayName = 'HiveFormProvider';
