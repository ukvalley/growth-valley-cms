import Container from "@/components/Container";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import { getPageContent, getSection, getPageSEO } from "@/lib/content";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('services');
  const seo = getPageSEO(content, 'services');
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

// Icon components for solutions
const solutionIcons: Record<string, React.ReactNode> = {
  'revenue-architecture': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  ),
  'sales-process': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.108 1.922c.227.394.134.905-.215 1.179l-.928.678a1.125 1.125 0 00-.398 1.026c.036.147.055.299.055.456v.227c0 .157-.02.31-.055.456a1.125 1.125 0 00.398 1.027l.928.677a1.125 1.125 0 01.215 1.179l-1.108 1.922a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.58.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.622 6.622 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.108-1.922a1.125 1.125 0 01.215-1.179l.928-.678a1.125 1.125 0 00.398-1.026 3.86 3.86 0 010-.456v-.227c0-.157.02-.31.055-.456a1.125 1.125 0 00-.398-1.027l-.928-.677a1.125 1.125 0 01-.215-1.179l1.108-1.922a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.074-.044.147-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'revops': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  'gtm': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.702-1.081-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.9 17.9 0 0112 16.5c-3.162 0-6.133-.868-8.716-2.387m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
};

export default async function SolutionsPage() {
  const content = await getPageContent('services');
  const hero = getSection<{ title: string; description: string }>(content, 'hero');
  const solutions = getSection<Array<{
    id: string;
    title: string;
    description: string;
    features: string[];
    outcomes: string[];
  }>>(content, 'solutions');
  const cta = getSection<{ title: string; description: string; buttonText: string; buttonLink: string }>(content, 'cta');

  return (
    <>
      <PageHeader
        title={hero?.title || "Revenue Solutions That Scale"}
        description={hero?.description || "We offer four core solutions, each designed to address specific revenue challenges. Deploy individually or together for maximum impact."}
      />

      <Section>
        <Container>
          <div className="space-y-20">
            {solutions?.map((solution, index) => (
              <div
                key={solution.id}
                id={solution.id}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-start ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="text-accent mb-6">
                    {solutionIcons[solution.id] || solutionIcons['revenue-architecture']}
                  </div>
                  <h2 className="text-heading-2 text-brand-black dark:text-white mb-4">
                    {solution.title}
                  </h2>
                  <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-8">
                    {solution.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-4">
                      What We Deliver
                    </h4>
                    <ul className="space-y-3">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-accent mt-1 flex-shrink-0"
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
                          <span className="text-body text-brand-grey-600 dark:text-brand-grey-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button href="/contact">Learn More</Button>
                </div>

                <div
                  className={`bg-brand-grey-50 dark:bg-brand-grey-900 p-8 ${
                    index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                  }`}
                >
                  <h4 className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-6">
                    Expected Outcomes
                  </h4>
                  <div className="space-y-4">
                    {solution.outcomes.map((outcome, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 border-b border-brand-grey-200 dark:border-brand-grey-700 pb-4 last:border-0 last:pb-0"
                      >
                        <span className="text-heading-4 text-accent">
                          ✓
                        </span>
                        <span className="text-body-lg text-brand-black dark:text-white">
                          {outcome}
                        </span>
                      </div>
                    ))}
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
              {cta?.title || "Not sure which solution you need?"}
            </h2>
            <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              {cta?.description || "Our discovery process identifies the highest-impact opportunities for your specific situation."}
            </p>
            <Button href={cta?.buttonLink || "/contact"}>
              {cta?.buttonText || "Schedule a Discovery Call"}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}