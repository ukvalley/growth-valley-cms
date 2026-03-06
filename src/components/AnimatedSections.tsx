'use client';

import { motion } from 'framer-motion';
import Container from "@/components/Container";
import Section, { SectionHeader } from "@/components/Section";
import Button, { CTAButton } from "@/components/Button";
import Card, { StatCard } from "@/components/Card";
import Link from "next/link";
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  StaggerContainer,
  StaggerItem,
  HoverLift,
  staggerItem
} from '@/components/animations';
import { getImageUrl } from '@/lib/utils';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Icons
const Icons = {
  Chart: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  Process: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.108 1.922c.227.394.134.905-.215 1.179l-.928.678a1.125 1.125 0 00-.398 1.026c.036.147.055.299.055.456v.227c0 .157-.02.31-.055.456a1.125 1.125 0 00.398 1.027l.928.677a1.125 1.125 0 01.215 1.179l-1.108 1.922a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.58.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.622 6.622 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.108-1.922a1.125 1.125 0 01.215-1.179l.928-.678a1.125 1.125 0 00.398-1.026 3.86 3.86 0 010-.456v-.227c0-.157.02-.31.055-.456a1.125 1.125 0 00-.398-1.027l-.928-.677a1.125 1.125 0 01.215-1.179l1.108-1.922a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.074-.044.147-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
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

// Decorative floating shapes component
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 -left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Geometric Shapes */}
      <motion.div
        className="absolute top-32 right-1/4 w-4 h-4 bg-accent/30 rotate-45"
        animate={{ rotate: [45, 90, 45], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-3 h-3 bg-accent/20 rounded-full"
        animate={{ scale: [1, 1.5, 1], y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-2 h-2 bg-accent/25 rotate-45"
        animate={{ rotate: [45, 135, 45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// Hero Section with animations
export function AnimatedHeroSection({ hero }: { hero: any }) {
  console.log("Home Content : ", hero)

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 bg-white dark:bg-brand-grey-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-gradient bg-dot-pattern" />
      <FloatingShapes />

      <Container className="relative z-10">
        <motion.div
          className="max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {hero?.label && (
            <motion.span
              className="text-label text-accent uppercase mb-6 block"
              variants={itemVariants}
            >
              {hero.label}
            </motion.span>
          )}
          <motion.h1
            // className="text-display text-brand-black dark:text-white mb-6"
            // variants={itemVariants}
            className="
    text-3xl 
    sm:text-4xl 
    md:text-5xl 
    lg:text-6xl 
    text-brand-black 
    dark:text-white 
    mb-6 
    leading-tight
  "
            variants={itemVariants}
          >
            {hero?.title ? (
              <>
                {hero.title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-accent">{hero.title.split(' ').slice(-1)}</span>
              </>
            ) : (
              'Predictable Revenue Systems for Scalable Businesses'
            )}
          </motion.h1>
          <motion.p
            // className="text-xl text-left text-brand-grey-500 dark:text-brand-grey-400 font-normal mb-10 max-w-3xl"
            // variants={itemVariants}
            className="
    text-base 
    sm:text-lg 
    md:text-xl 
    text-left 
    text-brand-grey-500 
    dark:text-brand-grey-400 
    font-normal 
    mb-10 
    max-w-3xl
  "
            variants={itemVariants}

          >
            {hero?.subtitle || 'We transform fragmented revenue operations into unified, predictable growth engines.'}
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4"
            variants={itemVariants}
          >
            {hero?.ctaText && (
              <CTAButton href={hero?.ctaLink || '/contact'}>{hero.ctaText}</CTAButton>
            )}
            {hero?.secondaryCtaText && (
              <Button href={hero?.secondaryCtaLink || '/case-studies'} variant="secondary">
                {hero.secondaryCtaText}
              </Button>
            )}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// Credibility Section with animations
export function AnimatedCredibilitySection({ stats }: { stats: any[] }) {
  return (
    <section className="relative py-16 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <motion.div
        className="absolute top-0 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {(stats || []).map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center"
            >
              <StatCard value={stat.value} label={stat.label} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// Problem Section with animations
export function AnimatedProblemSection({ problems }: { problems: any }) {
  return (
    <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
      {/* Diagonal Pattern */}
      <div className="absolute inset-0 bg-diagonal-pattern opacity-50" />
      <motion.div
        className="absolute -bottom-20 -right-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">
        <FadeInUp>
          <SectionHeader
            label={problems?.title || 'The Challenge'}
            title={problems?.subtitle || 'Most B2B companies struggle with revenue unpredictability'}
            description={problems?.description || 'Sound familiar? You\'re not alone.'}
          />
        </FadeInUp>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {(problems?.items || []).map((problem: any, index: number) => (
            <motion.div
              key={index}
              className="relative border-l-2 border-accent pl-6 py-4 bg-gradient-to-r from-accent/5 to-transparent"
              variants={itemVariants}
              whileHover={{ x: 4, backgroundColor: 'rgba(255, 193, 7, 0.05)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="absolute -left-1.5 top-4 w-3 h-3 bg-accent"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
              />
              <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                {problem.title}
              </h3>
              <p className="text-body text-left text-brand-grey-500 dark:text-brand-grey-400">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// Solution Section with animations
export function AnimatedSolutionSection({ solutions }: { solutions: any }) {
  console.log("Solutions : ", solutions)
  const iconMap: Record<string, JSX.Element> = {
    chart: <Icons.Chart />,
    process: <Icons.Process />,
    team: <Icons.Team />,
    target: <Icons.Target />,
  };

  return (
    <section className="relative py-20 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern" />
      <motion.div
        className="absolute top-1/4 -left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">
        <FadeInUp  >
          <SectionHeader
            label={solutions?.title || 'Our Approach'}
            title={solutions?.subtitle || 'Building predictable revenue, systematically'}
            description={solutions?.description || 'We don\'t offer quick fixes. We build lasting revenue systems.'}

          />
        </FadeInUp>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* {(solutions?.items || []).map((solution: any, index: number) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="h-full"
            >
              <Card
                title={solution.title}
                description={solution.description}
                icon={iconMap[solution.icon] || <Icons.Chart />}
                // href={`/solutions#${solution.id || solution.title?.toLowerCase().replace(/\s+/g, '-')}`}
                href={`/solutions#${solution.id}`}

              />
            </motion.div>
          ))} */}


          {(solutions?.items || []).map((solution: any, index: number) => {

            const solutionIds = [
              "revenue-architecture",
              "sales-process",
              "revops",
              "gtm"
            ];

            const solutionId = solution.id || solutionIds[index];

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="h-full"
              >
                <Card
                  title={solution.title}
                  description={solution.description}
                  icon={iconMap[solution.icon] || <Icons.Chart />}
                  href={`/solutions#${solutionId}`}
                />
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Button href="/solutions" variant="secondary">
            {solutions?.exploreButtonText || "Explore All Solutions"}

          </Button>
        </motion.div>
      </Container>
    </section>
  );
}

// Industries Section with animations
export function AnimatedIndustriesSection({ industries }: { industries: any }) {
  return (
    <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
      {/* Dot Pattern */}
      <div className="absolute inset-0 bg-dot-pattern" />
      <motion.div
        className="absolute top-20 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-2xl"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">

        <FadeInUp>
          <SectionHeader
            label={industries?.title || 'Industries'}
            title={industries?.subtitle || 'Deep expertise across B2B sectors'}
            description={industries?.description || 'We\'ve helped companies across industries transform.'}
          />

        </FadeInUp>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {(industries?.items || []).map((industry: any, index: number) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="h-full"
            >
              <Link
                href={`/industries#${industry.id || industry.name?.toLowerCase().replace(/\s+/g, '-')}`}
                className="block h-full bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-6 hover:border-accent hover:shadow-lg transition-all duration-300"
              >
                <motion.span
                  className="text-3xl mb-4 block"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {industry.icon}
                </motion.span>
                <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                  {industry.name}
                </h3>
                <p className="text-body-sm text-left text-brand-grey-500 dark:text-brand-grey-400">
                  {industry.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// Testimonials Section with animations
export function AnimatedTestimonialsSection({ testimonials }: { testimonials: any[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative py-20 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
      {/* Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <motion.div
        className="absolute top-1/3 left-0 w-56 h-56 bg-accent/8 rounded-full blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">
        <FadeInUp>
          <SectionHeader
            label="Testimonials"
            title="What Our Clients Say"
            description="Hear from the companies we've helped transform"
          />
        </FadeInUp>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {testimonials.slice(0, 6).map((testimonial: any, index: number) => (
            <motion.div
              key={testimonial._id || index}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-8 rounded-lg relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-accent/10">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Rating Stars */}
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-accent' : 'text-brand-grey-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-body text-brand-grey-600 dark:text-brand-grey-300 mb-6 italic relative z-10">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.avatar ? (
                  <img
                    src={getImageUrl(testimonial.avatar)}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent font-semibold text-lg">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-brand-black dark:text-white">
                    {testimonial.author}
                  </p>
                  {(testimonial.designation || testimonial.company) && (
                    <p className="text-body-sm text-brand-grey-500 dark:text-brand-grey-400">
                      {testimonial.designation}{testimonial.company && `, ${testimonial.company}`}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// Client Logos Section with animations
export function AnimatedClientLogosSection({ clients }: { clients: any[] }) {
  if (!clients || clients.length === 0) return null;

  return (
    <Section>
      <Container>
        <FadeInUp>
          <div className="text-center mb-12">
            <p className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase mb-4">
              Trusted By
            </p>
            <h2 className="text-heading-2 text-brand-black dark:text-white">
              Companies We've Worked With
            </h2>
          </div>
        </FadeInUp>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {clients.map((client: any, index: number) => (
            <motion.div
              key={client._id || index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex items-center justify-center p-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              {client.website ? (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-12 w-auto max-w-[120px] object-contain dark:hidden"
                  />
                  {client.logoDark && (
                    <img
                      src={client.logoDark}
                      alt={client.name}
                      className="h-12 w-auto max-w-[120px] object-contain hidden dark:block"
                    />
                  )}
                </a>
              ) : (
                <>
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-12 w-auto max-w-[120px] object-contain dark:hidden"
                  />
                  {client.logoDark && (
                    <img
                      src={client.logoDark}
                      alt={client.name}
                      className="h-12 w-auto max-w-[120px] object-contain hidden dark:block"
                    />
                  )}
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

// Case Study Preview Section with animations
export function AnimatedCaseStudyPreview({ caseStudyPreview }: { caseStudyPreview: any }) {
  return (
    <section className="relative py-20 bg-white dark:bg-brand-grey-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-diagonal-pattern" />
      <motion.div
        className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">
        <FadeInUp>
          <SectionHeader
            label={caseStudyPreview?.title || 'Results'}
            title={caseStudyPreview?.subtitle || 'Real transformations. Real numbers.'}
          />
        </FadeInUp>
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {(caseStudyPreview?.items || []).map((cs: any, index: number) => (
            // <motion.div
            //   key={index}
            //   variants={itemVariants}
            //   whileHover={{ y: -8, scale: 1.01 }}
            //   transition={{ type: 'spring', stiffness: 300 }}
            // >
            //   <Link
            //     href={cs.link || '/case-studies'}
            //     className="block bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 p-8 hover:border-accent hover:shadow-xl transition-all duration-300"
            //   >
            //     <div className="flex justify-between items-start mb-4">
            //       <span className="text-label text-brand-grey-400 dark:text-brand-grey-500 uppercase">
            //         {cs.industry}
            //       </span>
            //       <motion.span
            //         // className="text-heading-4 text-accent font-bold"
            //         className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-accent font-bold"

            //         initial={{ opacity: 0, scale: 0.5 }}
            //         whileInView={{ opacity: 1, scale: 1 }}
            //         viewport={{ once: true }}
            //         transition={{ delay: index * 0.2 + 0.3, type: 'spring' }}
            //       >
            //         {cs.result}
            //       </motion.span>
            //     </div>
            //     <h3 className="text-heading-3 text-brand-black dark:text-white mb-2">
            //       {cs.client}
            //     </h3>
            //     <p className="text-body text-brand-grey-500 dark:text-brand-grey-400">{cs.description}</p>
            //   </Link>
            // </motion.div>
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }} // subtle hover for all devices
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                href={cs.link || '/case-studies'}
                className="
      block 
      bg-white dark:bg-brand-grey-900 
      border border-brand-grey-200 dark:border-brand-grey-800 
      p-4 sm:p-6 md:p-8 
      hover:border-accent hover:shadow-xl 
      transition-all duration-300
      rounded-lg
    "
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  {/* Industry Label */}
                  <span className="text-xs sm:text-sm md:text-base text-brand-grey-400 dark:text-brand-grey-500 uppercase">
                    {cs.industry}
                  </span>

                  {/* Result Number */}
                  <motion.span
                    className="text-base sm:text-xs md:text-xl lg:text-2xl xl:text-3xl text-accent font-bold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.2, type: 'spring' }}
                  >
                    {cs.result}
                  </motion.span>
                </div>

                {/* Client Name */}
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-brand-black dark:text-white mb-1 sm:mb-2">
                  {cs.client}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-brand-grey-500 dark:text-brand-grey-400">
                  {cs.description}
                </p>
              </Link>
            </motion.div>

          ))}
        </motion.div>
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Button href="/case-studies" variant="secondary">
            View All Case Studies
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}

// Operating Model Section with animations
export function AnimatedOperatingModel({ process }: { process: any }) {
  return (
    <section className="relative py-20 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern" />

      {/* Decorative Line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <Container className="relative z-10">
        <FadeInUp>
          <SectionHeader
            label={process?.title || 'How We Work'}
            title={process?.subtitle || 'A systematic approach to transformation'}
          />
        </FadeInUp>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {(process?.steps || []).map((step: any, index: number) => (
            <motion.div
              key={index}
              className="relative"
              variants={itemVariants}
            >
              {/* Step Number Circle */}
              <motion.div
                className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 193, 7, 0.2)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-heading-2 text-accent font-bold">
                  {step.number || `0${index + 1}`}
                </span>
              </motion.div>

              {/* Content */}
              <div className="pl-2">
                <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-body text-left text-brand-grey-500 dark:text-brand-grey-400">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (except last) */}
              {index < (process?.steps?.length || 4) - 1 && (
                <motion.div
                  className="hidden lg:block absolute top-8 left-20 w-full h-0.5 bg-gradient-to-r from-accent/30 to-transparent"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// Final CTA Section with animations
export function AnimatedFinalCTA({ cta }: { cta: any }) {
  return (
    <section className="relative py-24 bg-brand-grey-50 dark:bg-brand-grey-900 overflow-hidden">
      {/* Animated Gradient */}
      <div className="absolute inset-0 bg-animated-gradient" />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 left-1/4 w-4 h-4 bg-accent/30 rounded-full"
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-3 h-3 bg-accent/20 rotate-45"
        animate={{ rotate: [45, 90, 45], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-2 h-2 bg-accent/25 rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/2 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2"
        animate={{ x: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-0 w-80 h-80 bg-accent/8 rounded-full blur-3xl -translate-y-1/2"
        animate={{ x: [0, -30, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-heading-1 text-brand-black dark:text-white mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {cta?.title || 'Ready for predictable revenue?'}
          </motion.h2>
          <motion.p
            className="text-body-lg text-brand-grey-500 dark:text-brand-grey-400 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {cta?.description || 'Let\'s discuss how Growth Valley can transform your revenue operations.'}
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CTAButton href={cta?.buttonLink || '/contact'}>{cta?.buttonText || 'Schedule a Call'}</CTAButton>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}