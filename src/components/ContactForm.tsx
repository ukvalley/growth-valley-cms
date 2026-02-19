"use client";

import Button from "@/components/Button";
import { useState } from "react";

interface ContactFormProps {
  interests: Array<{ value: string; label: string }>;
  contactInfo: {
    title: string;
    email: string;
    location: string;
  };
  expectations: {
    title: string;
    items: string[];
  };
  successMessage: {
    title: string;
    description: string;
  };
}

export default function ContactForm({ interests, contactInfo, expectations, successMessage }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          interest: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16">
      {/* Form */}
      <div>
        {status === "success" ? (
          <div className="bg-brand-grey-50 dark:bg-brand-grey-900 p-8 text-center border border-brand-grey-200 dark:border-brand-grey-800">
            <div className="w-16 h-16 bg-accent mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-brand-black"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h3 className="text-heading-3 text-brand-black dark:text-white mb-3">
              {successMessage.title}
            </h3>
            <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 mb-6">
              {successMessage.description}
            </p>
            <Button onClick={() => setStatus("idle")} variant="secondary">
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-body-sm text-brand-grey-600 dark:text-brand-grey-300 mb-2"
                >
                  Full Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-900 text-brand-black dark:text-white focus:border-accent focus:outline-none"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-body-sm text-brand-grey-600 dark:text-brand-grey-300 mb-2"
                >
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-900 text-brand-black dark:text-white focus:border-accent focus:outline-none"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="company"
                  className="block text-body-sm text-brand-grey-600 dark:text-brand-grey-300 mb-2"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-900 text-brand-black dark:text-white focus:border-accent focus:outline-none"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-body-sm text-brand-grey-600 dark:text-brand-grey-300 mb-2"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-900 text-brand-black dark:text-white focus:border-accent focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="interest"
                className="block text-body-sm text-brand-grey-600 dark:text-brand-grey-300 mb-2"
              >
                Area of Interest
              </label>
              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-900 text-brand-black dark:text-white focus:border-accent focus:outline-none"
              >
                <option value="">Select an option</option>
                {interests.map((interest) => (
                  <option key={interest.value} value={interest.value}>
                    {interest.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-body-sm text-brand-grey-600 dark:text-brand-grey-300 mb-2"
              >
                Message <span className="text-accent">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-900 text-brand-black dark:text-white focus:border-accent focus:outline-none resize-none"
                placeholder="Tell us about your revenue challenges..."
              />
            </div>

            {status === "error" && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-body-sm">
                Something went wrong. Please try again or email us directly.
              </div>
            )}

            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </div>

      {/* Info */}
      <div>
        <div className="bg-brand-grey-50 dark:bg-brand-grey-900 p-8 mb-8 border border-brand-grey-200 dark:border-brand-grey-800">
          <h3 className="text-heading-3 text-brand-black dark:text-white mb-4">
            {contactInfo.title}
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-body-sm text-brand-grey-400 dark:text-brand-grey-500 mb-1">
                Email
              </div>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-body text-brand-black dark:text-white hover:text-accent transition-colors"
              >
                {contactInfo.email}
              </a>
            </div>
            <div>
              <div className="text-body-sm text-brand-grey-400 dark:text-brand-grey-500 mb-1">
                Location
              </div>
              <div className="text-body text-brand-black dark:text-white">
                {contactInfo.location}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-black dark:bg-brand-grey-800 p-8 text-white">
          <h3 className="text-heading-3 mb-4">{expectations.title}</h3>
          <ul className="space-y-4">
            {expectations.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-body-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}