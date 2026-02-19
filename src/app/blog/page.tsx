import Container from "@/components/Container";
import Section from "@/components/Section";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export const metadata = {
  title: "Blog | Growth Valley",
  description: "Insights, strategies, and best practices for B2B revenue growth from the Growth Valley team.",
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getBlogs() {
  try {
    const res = await fetch(
      `${process.env.API_URL || "http://localhost:3001"}/api/blog`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();
  
  // Filter only published posts
  const publishedBlogs = blogs.filter((post: any) => post.status === "published");
  
  const featuredPosts = publishedBlogs.filter((post: any) => post.featured);
  const recentPosts = publishedBlogs
    .filter((post: any) => !post.featured)
    .sort(
      (a: any, b: any) =>
        new Date(b.publishDate || b.createdAt).getTime() -
        new Date(a.publishDate || a.createdAt).getTime()
    );

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Insights, strategies, and best practices for B2B revenue growth from our team."
      />

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <Section className="py-20 md:py-28 bg-white dark:bg-brand-grey-950">
          <Container>
            <span className="text-label text-accent uppercase mb-6 block">Featured</span>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post: any) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-8 hover:border-accent transition-colors group"
                >
                  {post.featuredImage && (
                    <div className="mb-6 -mx-8 -mt-8 overflow-hidden">
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-3 block">
                    {post.category}
                  </span>
                  <h3 className="text-heading-3 text-brand-black dark:text-white mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-body-sm text-brand-grey-400 dark:text-brand-grey-500">
                    <span>{post.author?.name || "Growth Valley"}</span>
                    <span>•</span>
                    <span>{post.readTime || 5} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* All Posts */}
      <Section className="py-20 md:py-28 bg-brand-grey-50 dark:bg-brand-grey-900">
        <Container>
          <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-6 block">
            All Articles
          </span>
          
          {publishedBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredPosts.length > 0 ? recentPosts : publishedBlogs).map((post: any) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 overflow-hidden hover:border-accent transition-colors group"
                >
                  {post.featuredImage && (
                    <div className="overflow-hidden">
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-2 block">
                      {post.category}
                    </span>
                    <h3 className="text-heading-4 text-brand-black dark:text-white mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-body-sm text-brand-grey-400 dark:text-brand-grey-500">
                      <span>{new Date(post.publishDate || post.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                      <span>{post.readTime || 5} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 md:py-28 bg-white dark:bg-brand-grey-950">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-6">
              Want personalized insights for your business?
            </h2>
            <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              Our discovery process uncovers specific opportunities in your revenue operations.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center font-semibold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-grey-950 disabled:opacity-50 disabled:cursor-not-allowed bg-accent text-brand-black hover:bg-accent-light focus:ring-accent px-6 py-3 text-sm"
            >
              Schedule a Discovery Call
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}