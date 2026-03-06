import Container from "@/components/Container";
import Section, { SectionHeader } from "@/components/Section";
import Button, { CTAButton } from "@/components/Button";
import Card, { StatCard } from "@/components/Card";
import Link from "next/link";
import { getPageContent, getSection, PageContent } from "@/lib/content";
import {
  AnimatedHeroSection,
  AnimatedCredibilitySection,
  AnimatedProblemSection,
  AnimatedSolutionSection,
  AnimatedIndustriesSection,
  AnimatedTestimonialsSection,
  AnimatedClientLogosSection,
  AnimatedCaseStudyPreview,
  AnimatedOperatingModel,
  AnimatedFinalCTA,
} from "@/components/AnimatedSections";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Disable static generation for dynamic content
export const dynamic = 'force-dynamic';

// Fetch testimonials from API
async function getTestimonials() {
  try {
    const res = await fetch(`${API_URL}/api/testimonials?status=active`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

// Fetch clients from API
async function getClients() {
  try {
    const res = await fetch(`${API_URL}/api/clients?status=active`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

// Fetch featured case studies from API and transform for home page
async function getFeaturedCaseStudies() {
  try {
    const res = await fetch(`${API_URL}/api/case-studies/featured?limit=2`, {
      cache: 'no-store'
    });
    const data = await res.json();

    if (!data.success || !data.data) {
      return [];
    }

    // Transform case studies to match component format
    return data.data.map((study: any) => ({
      client: study.clientName,
      industry: study.industry,
      result: study.results?.[0]?.value || study.results?.[0]?.metric || '',
      description: study.challenge,
      link: `/case-studies/${study.slug}`
    }));
  } catch {
    return [];
  }
}

export default async function Home() {
  // Fetch dynamic content
  const content = await getPageContent('home');

  // Fetch testimonials, clients, and featured case studies in parallel
  const [testimonials, clients, featuredCaseStudies] = await Promise.all([
    getTestimonials(),
    getClients(),
    getFeaturedCaseStudies()
  ]);

  // Extract sections from content
  const hero = getSection(content, 'hero');
  const stats = getSection(content, 'stats');
  const problems = getSection(content, 'problems');
  const solutions = getSection(content, 'solutions');
  const industries = getSection(content, 'industries');
  const caseStudyPreviewContent = getSection(content, 'caseStudyPreview');
  const process = getSection(content, 'process');
  const cta = getSection(content, 'cta');

  // Merge CMS content with dynamic case studies
  // Use featured case studies from database if available, otherwise fall back to CMS content
  const caseStudyPreview = {
    title: caseStudyPreviewContent?.title || 'Results',
    subtitle: caseStudyPreviewContent?.subtitle || 'Real transformations. Real numbers.',
    items: featuredCaseStudies.length > 0
      ? featuredCaseStudies
      : (caseStudyPreviewContent?.items || [])
  };

  return (
    <>
      <AnimatedHeroSection hero={hero} />
      <AnimatedCredibilitySection stats={stats} />
      <AnimatedClientLogosSection clients={clients} />
      <AnimatedProblemSection problems={problems} />
      <AnimatedSolutionSection solutions={solutions} />
      <AnimatedIndustriesSection industries={industries} />
      <AnimatedTestimonialsSection testimonials={testimonials} />
      <AnimatedCaseStudyPreview caseStudyPreview={caseStudyPreview} />
      <AnimatedOperatingModel process={process} />
      <AnimatedFinalCTA cta={cta} />
    </>
  );
}