import Container from "@/components/Container";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import { getPageContent, getSection, getPageSEO } from "@/lib/content";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('terms');
  const seo = getPageSEO(content, 'terms');
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function TermsPage() {
  const content = await getPageContent('terms');
  const hero = getSection(content, 'hero');
  const pageContent = getSection(content, 'content');
  const cta = getSection(content, 'cta');

  return (
    <>
      <PageHeader
        title={hero?.title || "Terms & Conditions"}
        description={hero?.lastUpdated ? `Last Updated: ${new Date(hero.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
        breadcrumb={[{ label: "Terms & Conditions", href: "/terms" }]}
      />

      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            {pageContent?.intro && (
              <p className="text-body-lg text-brand-grey-600 dark:text-brand-grey-300 mb-12 leading-relaxed">
                {pageContent.intro}
              </p>
            )}

            {/* Content Sections */}
            <div className="space-y-8">
              {(pageContent?.sections || []).map((section: any, index: number) => (
                <div key={index} className="border-b border-brand-grey-200 dark:border-brand-grey-700 pb-8 last:border-0">
                  <h2 className="text-heading-3 text-brand-black dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <p className="text-body text-brand-grey-600 dark:text-brand-grey-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            {cta && (
              <div className="mt-12 p-8 bg-brand-grey-50 dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 text-center">
                <h3 className="text-heading-4 text-brand-black dark:text-white mb-3">
                  {cta.title}
                </h3>
                <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 mb-6">
                  {cta.description}
                </p>
                <Button href={cta.buttonLink || '/contact'}>
                  {cta.buttonText || 'Contact Us'}
                </Button>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}