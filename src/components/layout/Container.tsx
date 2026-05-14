import { cn } from "@/lib/utils";

const containerSize = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof containerSize;
}

export function Container({ children, className, size = "lg" }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-4 md:px-6", containerSize[size], className)}>{children}</div>;
}
