interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href: string }[];
  background?: "white" | "grey";
}

export default function PageHeader({
  title,
  description,
  breadcrumb,
  background = "grey",
}: PageHeaderProps) {
  return (
    <section
      className={`pt-28 pb-12 md:pt-32 md:pb-16 ${
        background === "grey" ? "bg-brand-grey-50 dark:bg-brand-grey-900" : "bg-white dark:bg-brand-grey-950"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-body-sm">
              <li>
                <a
                  href="/"
                  className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              {breadcrumb.map((item, index) => (
                <li key={item.label} className="flex items-center gap-2">
                  <span className="text-brand-grey-300 dark:text-brand-grey-600">/</span>
                  {index === breadcrumb.length - 1 ? (
                    <span className="text-brand-black dark:text-white">{item.label}</span>
                  ) : (
                    <a
                      href={item.href}
                      className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-heading-1 text-brand-black dark:text-white max-w-4xl">{title}</h1>
        {description && (
          <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 max-w-3xl mt-4">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}