import AppText from "./AppText";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export default function FormError({ message, className = "" }: FormErrorProps) {
  if (!message) return null;

  return (
    <AppText variant="error" className={`mt-1.5 ${className}`}>
      {message}
    </AppText>
  );
}
