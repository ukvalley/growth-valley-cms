import PageHeader from "@/components/PageHeader";
import { getPageContent, getSection, getPageSEO } from "@/lib/content";
import { Metadata } from "next";
import SolutionsClient from "./SolutionsClient";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('services');
  const seo = getPageSEO(content, 'services');
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

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
      <SolutionsClient hero={hero} solutions={solutions} cta={cta} />
    </>
  );
}