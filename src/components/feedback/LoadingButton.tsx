import { Button, type ButtonProps } from '@/components/ui/button';

export function LoadingButton({
  loading,
  children,
  ...props
}: ButtonProps & { loading?: boolean }) {
  return (
    <Button loading={loading} disabled={loading || props.disabled} {...props}>
      {children}
    </Button>
  );
}
