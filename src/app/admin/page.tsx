'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dashboardAPI, blogAPI, caseStudyAPI, enquiryAPI } from '@/lib/admin-api';
import AdminLayout from './AdminLayout';

interface DashboardStats {
  counts: {
    blogs: { total: number; published: number };
    caseStudies: { total: number; published: number };
    enquiries: { total: number; new: number };
    media: number;
  };
  recent: {
    enquiries: any[];
    blogs: any[];
    caseStudies: any[];
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-brand-grey-200 dark:bg-brand-grey-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-brand-grey-200 dark:bg-brand-grey-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black dark:text-white">Dashboard</h1>
        <p className="text-brand-grey-500 dark:text-brand-grey-400 mt-1">Welcome back, {user?.name || 'Admin'}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-grey-500 dark:text-brand-grey-400 text-sm">Blog Posts</p>
              <p className="text-3xl font-bold text-brand-black dark:text-white mt-1">
                {stats?.counts.blogs.total || 0}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {stats?.counts.blogs.published || 0} published
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-2xl">
              📝
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-grey-500 dark:text-brand-grey-400 text-sm">Case Studies</p>
              <p className="text-3xl font-bold text-brand-black dark:text-white mt-1">
                {stats?.counts.caseStudies.total || 0}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {stats?.counts.caseStudies.published || 0} published
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-2xl">
              💼
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-grey-500 dark:text-brand-grey-400 text-sm">Enquiries</p>
              <p className="text-3xl font-bold text-brand-black dark:text-white mt-1">
                {stats?.counts.enquiries.total || 0}
              </p>
              <p className="text-sm text-accent mt-1">
                {stats?.counts.enquiries.new || 0} new
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-2xl">
              📧
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-grey-500 dark:text-brand-grey-400 text-sm">Media Files</p>
              <p className="text-3xl font-bold text-brand-black dark:text-white mt-1">
                {stats?.counts.media || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-2xl">
              🖼️
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800 mb-8">
        <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/blog/new"
            className="px-4 py-2 bg-accent text-brand-black font-medium rounded-lg hover:bg-accent-light transition-colors"
          >
            + New Blog Post
          </Link>
          <Link
            href="/admin/case-studies/new"
            className="px-4 py-2 bg-brand-black dark:bg-brand-grey-800 text-white font-medium rounded-lg hover:bg-brand-grey-800 dark:hover:bg-brand-grey-700 transition-colors"
          >
            + New Case Study
          </Link>
          <Link
            href="/admin/enquiries"
            className="px-4 py-2 bg-brand-grey-100 dark:bg-brand-grey-800 text-brand-black dark:text-white font-medium rounded-lg hover:bg-brand-grey-200 dark:hover:bg-brand-grey-700 transition-colors"
          >
            View Enquiries
          </Link>
        </div>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-black dark:text-white">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-accent hover:underline text-sm">
              View all →
            </Link>
          </div>
          {stats?.recent.enquiries.length === 0 ? (
            <p className="text-brand-grey-500 dark:text-brand-grey-400 text-center py-4">No enquiries yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.recent.enquiries.slice(0, 5).map((enquiry: any) => (
                <div key={enquiry._id} className="flex items-center justify-between py-2 border-b border-brand-grey-200 dark:border-brand-grey-700 last:border-0">
                  <div>
                    <p className="font-medium text-brand-black dark:text-white">{enquiry.name}</p>
                    <p className="text-sm text-brand-grey-500 dark:text-brand-grey-400">{enquiry.company}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    enquiry.status === 'new' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                    enquiry.status === 'contacted' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  }`}>
                    {enquiry.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-black dark:text-white">Recent Blog Posts</h2>
            <Link href="/admin/blog" className="text-accent hover:underline text-sm">
              View all →
            </Link>
          </div>
          {stats?.recent.blogs.length === 0 ? (
            <p className="text-brand-grey-500 dark:text-brand-grey-400 text-center py-4">No blog posts yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.recent.blogs.slice(0, 5).map((blog: any) => (
                <div key={blog._id} className="flex items-center justify-between py-2 border-b border-brand-grey-200 dark:border-brand-grey-700 last:border-0">
                  <div>
                    <p className="font-medium text-brand-black dark:text-white line-clamp-1">{blog.title}</p>
                    <p className="text-sm text-brand-grey-500 dark:text-brand-grey-400">{blog.category}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    blog.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    blog.status === 'draft' ? 'bg-grey-100 dark:bg-brand-grey-700 text-brand-grey-700 dark:text-brand-grey-300' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {blog.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}