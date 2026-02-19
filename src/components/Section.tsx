import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "white" | "grey";
}

export default function Section({
  children,
  className = "",
  id,
  background = "white",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-20 md:py-28 ${
        background === "grey" ? "bg-brand-grey-50 dark:bg-brand-grey-900" : "bg-white dark:bg-brand-grey-950"
      } ${className}`}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeader({
  label,
  title,
  description,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div
      className={`max-w-3xl ${centered ? "mx-auto text-center" : ""} mb-12 lg:mb-16`}
    >
      {label && (
        <span className="text-label text-accent uppercase mb-4 block">
          {label}
        </span>
      )}
      <h2 className="text-heading-2 md:text-heading-1 text-brand-black dark:text-white mb-4">{title}</h2>
      {description && (
        <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400">{description}</p>
      )}
    </div>
  );
}