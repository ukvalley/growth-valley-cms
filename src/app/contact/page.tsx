import Container from "@/components/Container";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { getPageContent, getSection, getPageSEO } from "@/lib/content";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('contact');
  const seo = getPageSEO(content, 'contact');
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function ContactPage() {
  const content = await getPageContent('contact');
  const hero = getSection<{ title: string; description: string }>(content, 'hero');
  const form = getSection<{
    interests: Array<{ value: string; label: string }>;
  }>(content, 'form');
  const info = getSection<{
    title: string;
    email: string;
    location: string;
  }>(content, 'info');
  const expectations = getSection<{
    title: string;
    items: string[];
  }>(content, 'expectations');
  const successMessage = getSection<{
    title: string;
    description: string;
  }>(content, 'successMessage');

  return (
    <>
      <PageHeader
        title={hero?.title || "Get in Touch"}
        description={hero?.description || "Ready to transform your revenue operations? Let's start the conversation."}
        breadcrumb={[{ label: "Contact", href: "/contact" }]}
      />

      <Section>
        <Container>
          <ContactForm
            interests={form?.interests || [
              { value: "revenue-architecture", label: "Revenue Architecture" },
              { value: "sales-process", label: "Sales Process Design" },
              { value: "revops", label: "RevOps Implementation" },
              { value: "gtm", label: "Go-to-Market Strategy" },
              { value: "other", label: "Other / Not Sure" },
            ]}
            contactInfo={{
              title: info?.title || "Direct Contact",
              email: info?.email || "hello@growthvalley.com",
              location: info?.location || "Nashik, Maharashtra, India",
            }}
            expectations={{
              title: expectations?.title || "What to Expect",
              items: expectations?.items || [
                "Response within one business day",
                "Initial discovery call to understand your situation",
                "Clear proposal with scope, timeline, and investment",
                "No commitment required for initial conversation",
              ],
            }}
            successMessage={{
              title: successMessage?.title || "Message Received",
              description: successMessage?.description || "Thank you for reaching out. We'll get back to you within one business day.",
            }}
          />
        </Container>
      </Section>
    </>
  );
}