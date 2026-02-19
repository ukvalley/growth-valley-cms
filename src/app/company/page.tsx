import Container from "@/components/Container";
import Section, { SectionHeader } from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import { getPageContent, getSection, getPageSEO } from "@/lib/content";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('company');
  const seo = getPageSEO(content, 'company');
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

async function getTeamMembers() {
  try {
    const res = await fetch(
      `${process.env.API_URL || "http://localhost:3001"}/api/team`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
}

export default async function CompanyPage() {
  const [content, teamMembers] = await Promise.all([
    getPageContent('company'),
    getTeamMembers()
  ]);

  const hero = getSection<{ title: string; description: string }>(content, 'hero');
  const mission = getSection<{ title: string; content: string }>(content, 'mission');
  const origin = getSection<{ title: string; content: string }>(content, 'origin');
  const values = getSection<{
    title: string;
    subtitle: string;
    items: Array<{ title: string; description: string }>;
  }>(content, 'values');
  const approach = getSection<{
    title: string;
    subtitle: string;
    steps: Array<{ number: string; title: string; description: string }>;
  }>(content, 'approach');
  const cta = getSection<{ title: string; description: string; buttonText: string; buttonLink: string }>(content, 'cta');

  return (
    <>
      <PageHeader
        title={hero?.title || "About Growth Valley"}
        description={hero?.description || "We help B2B companies transform fragmented revenue operations into unified, predictable growth engines."}
        breadcrumb={[{ label: "Company", href: "/company" }]}
      />

      <Section>
        <Container>
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Mission */}
            <div>
              <h2 className="text-heading-2 text-brand-black dark:text-white mb-6">
                {mission?.title || "Our Mission"}
              </h2>
              {mission?.content?.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-body-lg text-brand-grey-600 dark:text-brand-grey-300 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Origin */}
            <div className="bg-brand-grey-50 dark:bg-brand-grey-900 p-8 border border-brand-grey-200 dark:border-brand-grey-800">
              <h3 className="text-heading-3 text-brand-black dark:text-white mb-4">
                {origin?.title || "The Origin"}
              </h3>
              <p className="text-body text-brand-grey-600 dark:text-brand-grey-300 leading-relaxed">
                {origin?.content || "After years of leading revenue operations for high-growth B2B companies, our founding team saw the same patterns repeat: great teams hampered by broken systems. They set out to build the firm they wished existed—a partner that could diagnose the real problems and build lasting solutions."}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <Section background="grey">
          <Container>
            <SectionHeader
              label="Our Team"
              title="Expert guidance for your revenue transformation"
              description="Meet the people behind Growth Valley's success."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member: any) => (
                <div
                  key={member._id}
                  className="bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="aspect-square bg-brand-grey-100 dark:bg-brand-grey-800 relative overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-brand-grey-300 dark:text-brand-grey-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-heading-4 text-brand-black dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-body-sm text-accent mb-3">{member.role}</p>
                    {member.bio && (
                      <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400 line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                    
                    {/* Social Links */}
                    {(member.linkedin || member.twitter) && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-brand-grey-200 dark:border-brand-grey-700">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-grey-400 hover:text-accent transition-colors"
                            aria-label={`${member.name}'s LinkedIn`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-grey-400 hover:text-accent transition-colors"
                            aria-label={`${member.name}'s Twitter`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-4">
              {values?.title || "What We Believe"}
            </h2>
            <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 max-w-2xl mx-auto">
              {values?.subtitle || "Our values shape how we work with clients and each other."}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values?.items?.map((value, index) => (
              <div key={index} className="bg-white dark:bg-brand-grey-900 p-6 border border-brand-grey-200 dark:border-brand-grey-800">
                <h3 className="text-heading-4 text-brand-black dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-body text-brand-grey-500 dark:text-brand-grey-400">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="grey">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-4">
              {approach?.title || "How We Work"}
            </h2>
            <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 max-w-2xl mx-auto">
              {approach?.subtitle || "A partnership approach that creates lasting transformation."}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {approach?.steps?.map((step) => (
              <div key={step.number} className="relative">
                <span className="text-display text-brand-grey-200 dark:text-brand-grey-700 font-semibold absolute -top-4 left-0 z-0">
                  {step.number}
                </span>
                <div className="relative z-10 pt-16">
                  <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-body text-brand-grey-500 dark:text-brand-grey-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-6">
              {cta?.title || "Let's Build Something Together"}
            </h2>
            <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              {cta?.description || "Every transformation starts with a conversation. We'd love to hear about your revenue challenges."}
            </p>
            <Button href={cta?.buttonLink || "/contact"}>
              {cta?.buttonText || "Schedule a Call"}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}