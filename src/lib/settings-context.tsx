'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ContactInfo {
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface SocialLinks {
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

interface Hero {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

interface Footer {
  copyrightText: string;
  links: Array<{ label: string; url: string }>;
}

interface BusinessInfo {
  legalName: string;
  taxId: string;
  foundedYear: number | null;
  teamSize: string;
  description: string;
  logo: string;
  logoDark: string;
}

interface Tracking {
  googleAnalytics: string;
  googleTagManager: string;
  facebookPixel: string;
}

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
  hero: Hero;
  footer: Footer;
  businessInfo: BusinessInfo;
  tracking: Tracking;
  customCss: string;
  customJs: string;
  maintenanceMode: boolean;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

// Comprehensive defaults matching backend schema
const defaultSettings: SiteSettings = {
  siteName: 'Growth Valley',
  siteTagline: 'Accelerate Your Growth',
  siteDescription: 'Predictable Revenue Systems for Scalable Businesses. We help B2B companies transform their revenue operations.',
  contactInfo: {
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  },
  socialLinks: {
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
  },
  hero: {
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    backgroundImage: '',
  },
  footer: {
    copyrightText: '',
    links: [],
  },
  businessInfo: {
    legalName: '',
    taxId: '',
    foundedYear: null,
    teamSize: '',
    description: '',
    logo: '',
    logoDark: '',
  },
  tracking: {
    googleAnalytics: '',
    googleTagManager: '',
    facebookPixel: '',
  },
  customCss: '',
  customJs: '',
  maintenanceMode: false,
};

// Deep merge utility for nested objects
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T> | undefined): T {
  if (!source) return target;
  
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== undefined && source[key] !== null) {
      if (
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key] as any;
      }
    }
  }
  
  return result;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refetch: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/settings`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Deep merge with defaults to ensure all fields exist
          const mergedSettings = deepMerge(defaultSettings, data.data);
          setSettings(mergedSettings);
        } else {
          setSettings(defaultSettings);
        }
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings: settings || defaultSettings, loading, refetch: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Hook to get the appropriate logo based on theme
export function useLogo() {
  const { settings, loading } = useSettings();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if dark mode is active
    const checkDark = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkDark();

    // Observe theme changes
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Helper to get full URL for logo
  const getLogoUrl = (path: string | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return `${apiUrl}${path}`;
  };

  const logoLight = getLogoUrl(settings?.businessInfo?.logo);
  const logoDark = getLogoUrl(settings?.businessInfo?.logoDark);

  // In light mode, show dark logo (for light backgrounds)
  // In dark mode, show light logo (for dark backgrounds)
  // Determine logo based on current theme
  const logo = mounted && isDark ? (logoLight || logoDark) : (logoDark || logoLight);

  return {
    logo,
    logoLight,
    logoDark,
    siteName: settings?.siteName || defaultSettings.siteName,
    hasLogo: !!(settings?.businessInfo?.logo || settings?.businessInfo?.logoDark),
    loading,
    mounted,
  };
}

// Export defaults for use in other components
export { defaultSettings };
export type { SiteSettings, ContactInfo, SocialLinks, Hero, Footer, BusinessInfo, Tracking };
