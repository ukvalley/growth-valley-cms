import Container from "@/components/Container";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import Link from "next/link";

export const metadata = {
  title: "Case Studies",
  description:
    "Real transformations. Real numbers. See how we've helped B2B companies achieve predictable revenue growth.",
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getCaseStudies() {
  try {
    const res = await fetch(
      `${process.env.API_URL || "http://localhost:3001"}/api/case-studies`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch case studies:", error);
    return [];
  }
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();
  const featuredCaseStudies = caseStudies.filter((cs: any) => cs.featured);
  const otherCaseStudies = caseStudies.filter((cs: any) => !cs.featured);

  return (
    <>
      <PageHeader
        title="Case Studies"
        description="Real transformations. Real numbers. See how we've helped B2B companies achieve predictable revenue growth."
        breadcrumb={[{ label: "Case Studies", href: "/case-studies" }]}
      />

      <Section>
        <Container>
          {/* Featured Case Studies */}
          <div className="mb-16">
            <span className="text-label text-accent uppercase mb-6 block">
              Featured
            </span>
            {featuredCaseStudies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400">
                  Featured case studies coming soon!
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {featuredCaseStudies.map((cs: any) => (
                  <Link
                    key={cs._id || cs.slug}
                    href={`/case-studies/${cs.slug}`}
                    className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-8 hover:border-accent transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase">
                        {cs.industry}
                      </span>
                    </div>
                    <h3 className="text-heading-3 text-brand-black dark:text-white mb-3">
                      {cs.title}
                    </h3>
                    <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 mb-6">
                      {cs.challenge?.substring(0, 150)}...
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {cs.results?.slice(0, 2).map((result: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-brand-grey-50 dark:bg-brand-grey-800 p-4 border border-brand-grey-200 dark:border-brand-grey-700"
                        >
                          <div className="text-heading-3 text-brand-black dark:text-white">
                            {result.value}
                          </div>
                          <div className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400">
                            {result.metric}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other Case Studies */}
          {otherCaseStudies.length > 0 && (
            <div>
              <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-6 block">
                More Case Studies
              </span>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherCaseStudies.map((cs: any) => (
                  <Link
                    key={cs._id || cs.slug}
                    href={`/case-studies/${cs.slug}`}
                    className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-6 hover:border-accent transition-colors"
                  >
                    <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-2 block">
                      {cs.industry}
                    </span>
                    <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                      {cs.title}
                    </h3>
                    <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400 mb-4">
                      {cs.challenge?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-2 text-label text-accent">
                      <span className="font-semibold">
                        {cs.results?.[0]?.value}
                      </span>
                      <span>{cs.results?.[0]?.metric}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {caseStudies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400">
                Case studies coming soon! Check back for success stories.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <Section background="grey">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-6">
              Want results like these?
            </h2>
            <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              Every transformation starts with a conversation. Let's discuss
              your revenue challenges.
            </p>
            <Button href="/contact">Schedule a Call</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}