"use client";

import { motion } from "framer-motion";

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
      className={`relative pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden ${background === "grey" ? "bg-brand-grey-50 dark:bg-brand-grey-900" : "bg-white dark:bg-brand-grey-950"
        }`}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-dot-pattern" />

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-10 right-1/4 w-3 h-3 bg-accent/15 rounded-full"
        animate={{ scale: [1, 1.5, 1], y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-1/3 w-2 h-2 bg-accent/20 rotate-45"
        animate={{ rotate: [45, 90, 45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {breadcrumb && breadcrumb.length > 0 && (
          <motion.nav
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ol className="flex items-center gap-2 text-body-sm">
              <li>
                <motion.a
                  href="/"
                  className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors"
                  whileHover={{ x: 2 }}
                >
                  Home
                </motion.a>
              </li>
              {breadcrumb.map((item, index) => (
                <motion.li
                  key={item.label}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <span className="text-brand-grey-300 dark:text-brand-grey-600">/</span>
                  {index === breadcrumb.length - 1 ? (
                    <span className="text-brand-black dark:text-white">{item.label}</span>
                  ) : (
                    <motion.a
                      href={item.href}
                      className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      {item.label}
                    </motion.a>
                  )}
                </motion.li>
              ))}
            </ol>
          </motion.nav>
        )}
        <motion.h1
          className="text-heading-1 text-brand-black dark:text-white max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            className="text-body-lg text-left text-brand-grey-500 dark:text-brand-grey-400 max-w-3xl mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}