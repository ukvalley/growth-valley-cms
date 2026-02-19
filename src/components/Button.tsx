import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "large" | "small";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "default",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-grey-950 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-accent text-brand-black hover:bg-accent-light focus:ring-accent",
    secondary:
      "border-2 border-brand-black dark:border-white text-brand-black dark:text-white hover:bg-brand-black dark:hover:bg-white hover:text-white dark:hover:text-brand-black focus:ring-brand-black dark:focus:ring-white",
    ghost:
      "text-accent hover:bg-accent/10 focus:ring-accent",
  };

  const sizes = {
    small: "px-5 py-2.5 text-xs",
    default: "px-6 py-3 text-sm",
    large: "px-8 py-4 text-base",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}

export function CTAButton({
  children,
  href,
  onClick,
  className = "",
}: Omit<ButtonProps, "variant">) {
  return (
    <Button
      href={href}
      onClick={onClick}
      variant="primary"
      className={className}
    >
      {children}
    </Button>
  );
}