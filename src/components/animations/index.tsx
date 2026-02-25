'use client';

import { motion, MotionProps, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// Animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface AnimatedProps extends MotionProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Animated wrapper components
export function FadeIn({ children, className, as = 'div', ...props }: AnimatedProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeIn}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export function FadeInUp({ children, className, as = 'div', ...props }: AnimatedProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export function FadeInLeft({ children, className, as = 'div', ...props }: AnimatedProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeInLeft}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export function FadeInRight({ children, className, as = 'div', ...props }: AnimatedProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeInRight}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export function ScaleIn({ children, className, as = 'div', ...props }: AnimatedProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={scaleIn}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

interface StaggerContainerProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}

export function StaggerContainer({ 
  children, 
  className, 
  delayChildren = 0.1, 
  staggerChildren = 0.1,
  ...props 
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...props }: AnimatedProps) {
  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}

// Hover animations
export function HoverScale({ children, className, scale = 1.02, ...props }: AnimatedProps & { scale?: number }) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({ children, className, ...props }: AnimatedProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Page transition wrapper
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Counter animation
interface CounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function Counter({ value, duration = 2, className, prefix = '', suffix = '' }: CounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {value}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

// Floating animation
export function Floating({ children, className, ...props }: AnimatedProps) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Export motion for custom animations
export { motion };