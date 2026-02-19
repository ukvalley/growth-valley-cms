import Container from "@/components/Container";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCaseStudy(slug: string) {
  try {
    const res = await fetch(
      `${process.env.API_URL || "http://localhost:3001"}/api/case-studies/${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch case study:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);
  return {
    title: caseStudy?.seo?.metaTitle || caseStudy?.title || "Case Study",
    description: caseStudy?.seo?.metaDescription || caseStudy?.challenge?.substring(0, 160),
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return (
      <Section>
        <Container>
          <div className="text-center py-16">
            <h1 className="text-heading-1 text-brand-black mb-4">
              Case Study Not Found
            </h1>
            <p className="text-body text-brand-grey-500 mb-8">
              The case study you're looking for doesn't exist.
            </p>
            <Button href="/case-studies">View All Case Studies</Button>
          </div>
        </Container>
      </Section>
    );
  }

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    if (!content) return null;
    return content.split("\n\n").map((paragraph, idx) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="text-heading-3 text-brand-black mt-8 mb-4 first:mt-0"
          >
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
      if (paragraph.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-heading-4 text-brand-black mt-6 mb-3 first:mt-0"
          >
            {paragraph.replace("### ", "")}
          </h3>
        );
      }
      if (paragraph.startsWith("**")) {
        // Bold paragraphs (like solution steps)
        return (
          <p key={idx} className="text-body-lg text-brand-grey-600 mb-4 font-semibold">
            {paragraph.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (paragraph.startsWith("1. ") || paragraph.startsWith("- ")) {
        const items = paragraph.split("\n");
        const isOrdered = paragraph.startsWith("1. ");
        const ListTag = isOrdered ? "ol" : "ul";
        return (
          <ListTag
            key={idx}
            className={`mb-6 ${isOrdered ? "list-decimal" : "list-disc"} pl-6`}
          >
            {items.map((item, itemIdx) => (
              <li key={itemIdx} className="text-body-lg text-brand-grey-600 mb-2">
                {item.replace(/^[\d.\-]\s*/, "").replace(/\*\*/g, "")}
              </li>
            ))}
          </ListTag>
        );
      }
      return (
        <p key={idx} className="text-body-lg text-brand-grey-600 mb-6">
          {paragraph.replace(/\*\*/g, "")}
        </p>
      );
    });
  };

  return (
    <>
      <PageHeader
        title={caseStudy.title}
        description={caseStudy.challenge?.substring(0, 150) + "..."}
        breadcrumb={[
          { label: "Case Studies", href: "/case-studies" },
          { label: caseStudy.industry, href: `/case-studies/${caseStudy.slug}` },
        ]}
      />

      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Meta info */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-brand-grey-100">
              <span className="text-label text-brand-yellow uppercase">
                {caseStudy.industry}
              </span>
              <span className="text-body-sm text-brand-grey-400">
                {caseStudy.clientName}
              </span>
              {caseStudy.timeline && (
                <span className="text-body-sm text-brand-grey-400">
                  {caseStudy.timeline}
                </span>
              )}
            </div>

            {/* Results Grid */}
            {caseStudy.results && caseStudy.results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {caseStudy.results.map((result: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-brand-grey-50 border border-brand-grey-100 p-6 text-center"
                  >
                    <div className="text-heading-2 text-accent mb-1">
                      {result.value}
                    </div>
                    <div className="text-body-sm text-brand-grey-500">
                      {result.metric}
                    </div>
                    {result.description && (
                      <div className="text-body-xs text-brand-grey-400 mt-1">
                        {result.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Challenge */}
            <div className="mb-12">
              <h2 className="text-heading-3 text-brand-black mb-4">
                The Challenge
              </h2>
              {renderContent(caseStudy.challenge)}
            </div>

            {/* Solution */}
            {caseStudy.solution && (
              <div className="mb-12">
                <h2 className="text-heading-3 text-brand-black mb-4">
                  Our Solution
                </h2>
                {renderContent(caseStudy.solution)}
              </div>
            )}

            {/* Technologies */}
            {caseStudy.technologies && caseStudy.technologies.length > 0 && (
              <div className="mb-12">
                <h2 className="text-heading-3 text-brand-black mb-4">
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="text-body-sm text-brand-grey-600 bg-brand-grey-100 px-3 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonial */}
            {caseStudy.testimonial && caseStudy.testimonial.quote && (
              <div className="bg-brand-black p-8 mb-12">
                <blockquote className="text-heading-4 text-brand-white mb-6">
                  "{caseStudy.testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-grey-800 rounded-full flex items-center justify-center">
                    <span className="text-heading-4 text-brand-grey-400">
                      {caseStudy.testimonial.author?.charAt(0) || "C"}
                    </span>
                  </div>
                  <div>
                    <div className="text-body text-brand-white">
                      {caseStudy.testimonial.author}
                    </div>
                    <div className="text-body-sm text-brand-grey-400">
                      {caseStudy.testimonial.designation || caseStudy.clientName}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-brand-grey-50 p-8">
              <h3 className="text-heading-4 text-brand-black mb-3">
                Want similar results for your business?
              </h3>
              <p className="text-body text-brand-grey-500 mb-6">
                Let's discuss how we can help transform your revenue operations.
              </p>
              <Button href="/contact">Schedule a Call</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}