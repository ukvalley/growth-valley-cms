import Container from "@/components/Container";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import { getPageContent, getSection, getPageSEO } from "@/lib/content";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('industries');
  const seo = getPageSEO(content, 'industries');
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function IndustriesPage() {
  const content = await getPageContent('industries');
  const hero = getSection<{ title: string; description: string }>(content, 'hero');
  const industries = getSection<Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    challenges: string[];
    results: string[];
    caseStudyCount: number;
  }>>(content, 'industries');
  const cta = getSection<{ title: string; description: string; buttonText: string; buttonLink: string }>(content, 'cta');

  return (
    <>
      <PageHeader
        title={hero?.title || "Industry Expertise"}
        description={hero?.description || "We understand the unique challenges of each sector. Our playbook adapts to your industry while drawing on proven patterns from across B2B."}
        breadcrumb={[{ label: "Industries", href: "/industries" }]}
      />

      <Section>
        <Container>
          <div className="space-y-16">
            {industries?.map((industry, index) => (
              <div
                key={industry.id}
                id={industry.id}
                className="grid lg:grid-cols-5 gap-8 lg:gap-12"
              >
                {/* Left side - Industry header */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{industry.icon}</span>
                    <h2 className="text-heading-2 text-brand-black dark:text-white">
                      {industry.name}
                    </h2>
                  </div>
                  <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 mb-6">
                    {industry.description}
                  </p>
                  <div className="flex items-center gap-2 text-label text-accent">
                    <span>{industry.caseStudyCount}</span>
                    <span>Case Studies</span>
                  </div>
                </div>

                {/* Right side - Challenges and Results */}
                <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
                  {/* Challenges */}
                  <div className="bg-brand-grey-50 dark:bg-brand-grey-900 p-6">
                    <h4 className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-4">
                      Common Challenges
                    </h4>
                    <ul className="space-y-3">
                      {industry.challenges.map((challenge, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-body-sm text-brand-grey-600 dark:text-brand-grey-300"
                        >
                          <span className="text-accent mt-1">•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Results */}
                  <div className="bg-brand-black dark:bg-brand-grey-800 p-6 text-white">
                    <h4 className="text-label text-brand-grey-400 uppercase mb-4">
                      Typical Results
                    </h4>
                    <ul className="space-y-3">
                      {industry.results.map((result, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-body-sm"
                        >
                          <span className="text-accent mt-1">✓</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="grey">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-6">
              {cta?.title || "Don't see your industry?"}
            </h2>
            <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              {cta?.description || "Our methodology applies across B2B sectors. If you sell to businesses, we can help transform your revenue operations."}
            </p>
            <Button href={cta?.buttonLink || "/contact"}>
              {cta?.buttonText || "Tell Us About Your Industry"}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}