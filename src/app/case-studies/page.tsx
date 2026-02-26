import PageHeader from "@/components/PageHeader";
import { Metadata } from "next";
import CaseStudiesClient from "./CaseStudiesClient";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real transformations. Real numbers. See how we've helped B2B companies achieve predictable revenue growth.",
};

export const dynamic = 'force-dynamic';

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
      <CaseStudiesClient 
        featuredCaseStudies={featuredCaseStudies}
        otherCaseStudies={otherCaseStudies}
        caseStudies={caseStudies}
      />
    </>
  );
}