import PageHeader from "@/components/PageHeader";
import { getPageContent, getSection, getPageSEO } from "@/lib/content";
import { Metadata } from "next";
import IndustriesClient from "./IndustriesClient";

export const dynamic = 'force-dynamic';

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
      <IndustriesClient hero={hero} industries={industries} cta={cta} />
    </>
  );
}