import Container from "@/components/Container";
import Section, { SectionHeader } from "@/components/Section";
import Button, { CTAButton } from "@/components/Button";
import Card, { StatCard } from "@/components/Card";
import Link from "next/link";
import { getPageContent, getSection, PageContent } from "@/lib/content";

// Icons
const Icons = {
  Chart: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  Process: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.108 1.922c.227.394.134.905-.215 1.179l-.928.678a1.125 1.125 0 00-.398 1.026c.036.147.055.299.055.456v.227c0 .157-.02.31-.055.456a1.125 1.125 0 00.398 1.027l.928.677a1.125 1.125 0 01.215 1.179l-1.108 1.922a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.58.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.622 6.622 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.108-1.922a1.125 1.125 0 01.215-1.179l.928-.678a1.125 1.125 0 00.398-1.026 3.86 3.86 0 010-.456v-.227c0-.157.02-.31.055-.456a1.125 1.125 0 00-.398-1.027l-.928-.677a1.125 1.125 0 01-.215-1.179l1.108-1.922a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.074-.044.147-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Team: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Target: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
};

// Hero Section
function HeroSection({ hero }: { hero: any }) {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 bg-white dark:bg-brand-grey-950">
      <Container>
        <div className="max-w-4xl">
          {hero?.label && (
            <span className="text-label text-accent uppercase mb-6 block">
              {hero.label}
            </span>
          )}
          <h1 className="text-display text-brand-black dark:text-white mb-6">
            {hero?.title ? (
              <>
                {hero.title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-accent">{hero.title.split(' ').slice(-1)}</span>
              </>
            ) : (
              'Predictable Revenue Systems for Scalable Businesses'
            )}
          </h1>
          <p className="text-heading-3 text-brand-grey-500 dark:text-brand-grey-400 font-normal mb-10 max-w-3xl">
            {hero?.subtitle || 'We transform fragmented revenue operations into unified, predictable growth engines.'}
          </p>
          <div className="flex flex-wrap gap-4">
            {hero?.ctaText && (
              <CTAButton href={hero?.ctaLink || '/contact'}>{hero.ctaText}</CTAButton>
            )}
            {hero?.secondaryCtaText && (
              <Button href={hero?.secondaryCtaLink || '/case-studies'} variant="secondary">
                {hero.secondaryCtaText}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

// Credibility Section
function CredibilitySection({ stats }: { stats: any[] }) {
  return (
    <Section background="grey">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {(stats || []).map((stat, index) => (
            <StatCard key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

// Problem Section
function ProblemSection({ problems }: { problems: any }) {
  return (
    <Section>
      <Container>
        <SectionHeader
          label={problems?.title || 'The Challenge'}
          title={problems?.subtitle || 'Most B2B companies struggle with revenue unpredictability'}
          description={problems?.description || 'Sound familiar? You\'re not alone.'}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(problems?.items || []).map((problem: any, index: number) => (
            <div key={index} className="border-l-2 border-accent pl-6">
              <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                {problem.title}
              </h3>
              <p className="text-body text-brand-grey-500 dark:text-brand-grey-400">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// Solution Architecture Section
function SolutionSection({ solutions }: { solutions: any }) {
  const iconMap: Record<string, JSX.Element> = {
    chart: <Icons.Chart />,
    process: <Icons.Process />,
    team: <Icons.Team />,
    target: <Icons.Target />,
  };

  return (
    <Section background="grey">
      <Container>
        <SectionHeader
          label={solutions?.title || 'Our Approach'}
          title={solutions?.subtitle || 'Building predictable revenue, systematically'}
          description={solutions?.description || 'We don\'t offer quick fixes. We build lasting revenue systems.'}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(solutions?.items || []).map((solution: any, index: number) => (
            <Card
              key={index}
              title={solution.title}
              description={solution.description}
              icon={iconMap[solution.icon] || <Icons.Chart />}
              href="/solutions"
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/solutions" variant="secondary">
            Explore All Solutions
          </Button>
        </div>
      </Container>
    </Section>
  );
}

// Industries Section
function IndustriesSection({ industries }: { industries: any }) {
  return (
    <Section>
      <Container>
        <SectionHeader
          label={industries?.title || 'Industries'}
          title={industries?.subtitle || 'Deep expertise across B2B sectors'}
          description={industries?.description || 'We\'ve helped companies across industries transform.'}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(industries?.items || []).map((industry: any, index: number) => (
            <Link
              key={index}
              href="/industries"
              className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-6 hover:border-accent transition-colors"
            >
              <span className="text-3xl mb-4 block">{industry.icon}</span>
              <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                {industry.name}
              </h3>
              <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400">
                {industry.description}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// Case Study Preview Section
function CaseStudyPreview({ caseStudyPreview }: { caseStudyPreview: any }) {
  return (
    <Section background="grey">
      <Container>
        <SectionHeader
          label={caseStudyPreview?.title || 'Results'}
          title={caseStudyPreview?.subtitle || 'Real transformations. Real numbers.'}
        />
        <div className="grid md:grid-cols-2 gap-8">
          {(caseStudyPreview?.items || []).map((cs: any, index: number) => (
            <Link
              key={index}
              href={cs.link || '/case-studies'}
              className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-8 hover:border-accent transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase">
                  {cs.industry}
                </span>
                <span className="text-heading-4 text-accent">
                  {cs.result}
                </span>
              </div>
              <h3 className="text-heading-3 text-brand-black dark:text-white mb-2">
                {cs.client}
              </h3>
              <p className="text-body text-brand-grey-500 dark:text-brand-grey-400">{cs.description}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/case-studies" variant="secondary">
            View All Case Studies
          </Button>
        </div>
      </Container>
    </Section>
  );
}

// Operating Model Section
function OperatingModel({ process }: { process: any }) {
  return (
    <Section>
      <Container>
        <SectionHeader
          label={process?.title || 'How We Work'}
          title={process?.subtitle || 'A systematic approach to transformation'}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(process?.steps || []).map((step: any, index: number) => (
            <div key={index} className="relative">
              <span className="text-display text-brand-grey-200/50 dark:text-brand-grey-700 font-semibold absolute -top-4 left-0 z-0">
                {step.number || `0${index + 1}`}
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
  );
}

// Final CTA Section
function FinalCTA({ cta }: { cta: any }) {
  return (
    <Section background="grey">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-heading-1 text-brand-black dark:text-white mb-6">
            {cta?.title || 'Ready for predictable revenue?'}
          </h2>
          <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-10">
            {cta?.description || 'Let\'s discuss how Growth Valley can transform your revenue operations.'}
          </p>
          <CTAButton href={cta?.buttonLink || '/contact'}>{cta?.buttonText || 'Schedule a Call'}</CTAButton>
        </div>
      </Container>
    </Section>
  );
}

export default async function Home() {
  // Fetch dynamic content
  const content = await getPageContent('home');
  
  // Extract sections
  const hero = getSection(content, 'hero');
  const stats = getSection(content, 'stats');
  const problems = getSection(content, 'problems');
  const solutions = getSection(content, 'solutions');
  const industries = getSection(content, 'industries');
  const caseStudyPreview = getSection(content, 'caseStudyPreview');
  const process = getSection(content, 'process');
  const cta = getSection(content, 'cta');

  return (
    <>
      <HeroSection hero={hero} />
      <CredibilitySection stats={stats} />
      <ProblemSection problems={problems} />
      <SolutionSection solutions={solutions} />
      <IndustriesSection industries={industries} />
      <CaseStudyPreview caseStudyPreview={caseStudyPreview} />
      <OperatingModel process={process} />
      <FinalCTA cta={cta} />
    </>
  );
}