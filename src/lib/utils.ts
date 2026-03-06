
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';


// Utility function to generate slugs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}
// Get full URL for images/media
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getImageUrl = (path?: string) => {
  if (!path) return ''; // fallback if no image
  if (path.startsWith('http')) return path; // full URL already
  return `${API_BASE_URL}${path}`; // prepend backend URL
};

export async function fetchAPI(endpoint: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
  );

  if (!res.ok) throw new Error('API Error');

  return res.json();
}

// lib/publicApi.ts

export async function getPageContent(page: string) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:3001";

  const res = await fetch(`${apiUrl}/api/content/${page}`, {
    cache: "no-store",   // 🔥 VERY IMPORTANT
  });

  if (!res.ok) {
    throw new Error("Failed to fetch page content");
  }

  const data = await res.json();
  return data.data;
}

// Fetch case studies from backend
async function getCaseStudies() {
  try {
    const res = await fetch(`${API_URL}/api/case-studies?status=active`, {
      cache: 'no-store', // always get fresh data
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching case studies:', err);
    return [];
  }
}