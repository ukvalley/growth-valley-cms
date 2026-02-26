"use client";

import Container from "@/components/Container";
import Button from "@/components/Button";
import Link from "next/link";
import { motion } from "framer-motion";

interface CaseStudy {
  _id?: string;
  slug: string;
  title: string;
  industry: string;
  challenge?: string;
  featured?: boolean;
  results?: Array<{ value: string; metric: string }>;
}

interface CaseStudiesClientProps {
  featuredCaseStudies: CaseStudy[];
  otherCaseStudies: CaseStudy[];
  caseStudies: CaseStudy[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CaseStudiesClient({ featuredCaseStudies, otherCaseStudies, caseStudies }: CaseStudiesClientProps) {
  return (
    <>
      <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dot-pattern" />
        <motion.div 
          className="absolute top-20 right-1/4 w-4 h-4 bg-accent/20 rotate-45"
          animate={{ rotate: [45, 90, 45], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <Container className="relative z-10">
          {/* Featured Case Studies */}
          <div className="mb-16">
            <motion.span 
              className="text-label text-accent uppercase mb-6 block"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Featured
            </motion.span>
            {featuredCaseStudies.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400">
                  Featured case studies coming soon!
                </p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid lg:grid-cols-2 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {featuredCaseStudies.map((cs) => (
                  <motion.div
                    key={cs._id || cs.slug}
                    variants={itemVariants}
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  >
                    <Link
                      href={`/case-studies/${cs.slug}`}
                      className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-8 hover:border-accent transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Accent corner */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5" />
                      
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase">
                          {cs.industry}
                        </span>
                      </div>
                      <h3 className="text-heading-3 text-brand-black dark:text-white mb-3 relative z-10">
                        {cs.title}
                      </h3>
                      <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 mb-6 relative z-10">
                        {cs.challenge?.substring(0, 150)}...
                      </p>
                      <div className="grid grid-cols-2 gap-4 relative z-10">
                        {cs.results?.slice(0, 2).map((result, idx) => (
                          <motion.div
                            key={idx}
                            className="bg-brand-grey-50 dark:bg-brand-grey-800 p-4 border border-brand-grey-200 dark:border-brand-grey-700"
                            whileHover={{ scale: 1.02 }}
                          >
                            <motion.div 
                              className="text-heading-3 text-accent"
                              initial={{ opacity: 0, scale: 0.5 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1, type: 'spring' }}
                            >
                              {result.value}
                            </motion.div>
                            <div className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400">
                              {result.metric}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Other Case Studies */}
          {otherCaseStudies.length > 0 && (
            <div>
              <motion.span 
                className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-6 block"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                More Case Studies
              </motion.span>
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {otherCaseStudies.map((cs) => (
                  <motion.div
                    key={cs._id || cs.slug}
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  >
                    <Link
                      href={`/case-studies/${cs.slug}`}
                      className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-6 hover:border-accent transition-all duration-300"
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
                        <motion.span 
                          className="font-semibold"
                          whileHover={{ scale: 1.1 }}
                        >
                          {cs.results?.[0]?.value}
                        </motion.span>
                        <span>{cs.results?.[0]?.metric}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {caseStudies.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400">
                Case studies coming soon! Check back for success stories.
              </p>
            </motion.div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-animated-gradient" />
        
        {/* Floating Shapes */}
        <motion.div 
          className="absolute top-10 left-1/4 w-4 h-4 bg-accent/30 rounded-full"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-1/3 w-3 h-3 bg-accent/25 rotate-45"
          animate={{ rotate: [45, 90, 45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <Container className="relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading-2 text-brand-black dark:text-white mb-6">
              Want results like these?
            </h2>
            <p className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-10">
              Every transformation starts with a conversation. Let's discuss
              your revenue challenges.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button href="/contact">Schedule a Call</Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}