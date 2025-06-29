interface ButtonProps {
  primary?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
}

const getButtonStyles = (primary: boolean, size: string) => {
  const baseStyles = {
    fontFamily: 'Nunito Sans, Helvetica Neue, Helvetica, Arial, sans-serif',
    fontWeight: 700,
    border: 0,
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'inline-block',
    lineHeight: 1,
  };

  const sizeStyles = {
    small: { fontSize: '12px', padding: '10px 16px' },
    medium: { fontSize: '14px', padding: '11px 20px' },
    large: { fontSize: '16px', padding: '12px 24px' },
  };

  const colorStyles = primary
    ? { color: 'white', backgroundColor: '#1ea7fd' }
    : {
        color: '#333',
        backgroundColor: 'transparent',
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset',
      };

  return {
    ...baseStyles,
    ...sizeStyles[size as keyof typeof sizeStyles],
    ...colorStyles,
  };
};

export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const styles = getButtonStyles(primary, size);

  return (
    <button
      type="button"
      style={{ ...styles, backgroundColor: backgroundColor || styles.backgroundColor }}
      {...props}
    >
      {label} 🚀
    </button>
  );
};
