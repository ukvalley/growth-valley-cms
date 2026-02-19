'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { blogAPI } from '@/lib/admin-api';
import AdminLayout from '../../AdminLayout';

const categories = ['Strategy', 'Automation', 'Performance', 'Technology', 'Growth', 'General'];

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'General',
    tags: '',
    status: 'draft',
    featured: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
  });

  useEffect(() => {
    if (id) loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      const response = await blogAPI.getBySlug(id);
      if (response.success) {
        const blog = response.data;
        setFormData({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          category: blog.category,
          tags: (blog.tags || []).join(', '),
          status: blog.status,
          featured: blog.featured || false,
          seo: {
            metaTitle: blog.seo?.metaTitle || '',
            metaDescription: blog.seo?.metaDescription || '',
            keywords: (blog.seo?.keywords || []).join(', '),
          },
        });
      }
    } catch (error) {
      alert('Failed to load blog post');
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        seo: {
          metaTitle: formData.seo.metaTitle || formData.title,
          metaDescription: formData.seo.metaDescription || formData.excerpt,
          keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(Boolean),
        },
        publishDate: formData.status === 'published' ? new Date() : undefined,
      };

      const response = await blogAPI.update(id, data);
      if (response.success) {
        router.push('/admin/blog');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-brand-grey-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-brand-grey-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/blog" className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white">
            ← Back to Blog
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-brand-black dark:text-white mb-8">Edit Blog Post</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white p-6 rounded-lg border border-brand-grey-100 space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-brand-grey-200 rounded-lg focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                required
                pattern="[a-z0-9-]+"
                className="w-full px-4 py-3 border border-brand-grey-200 rounded-lg focus:outline-none focus:border-brand-yellow"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Excerpt *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              required
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 border border-brand-grey-200 rounded-lg focus:outline-none focus:border-brand-yellow"
            />
            <p className="text-xs text-brand-grey-400 mt-1">
              {formData.excerpt.length}/300 characters
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              rows={15}
              className="w-full px-4 py-3 border border-brand-grey-200 rounded-lg focus:outline-none focus:border-brand-yellow font-mono text-sm"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-brand-grey-200 rounded-lg focus:outline-none focus:border-brand-yellow"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 border border-brand-grey-200 rounded-lg focus:outline-none focus:border-brand-yellow"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          {/* Status & Featured */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 border border-brand-grey-200 rounded-lg focus:outline-none focus:border-brand-yellow"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 rounded border-brand-grey-300 text-brand-yellow focus:ring-brand-yellow"
                />
                <span className="text-sm font-medium text-brand-black">Featured Post</span>
              </label>
            </div>
          </div>

          {/* SEO Section */}
          <div className="border-t border-brand-grey-100 pt-6">
            <h3 className="text-lg font-semibold text-brand-black mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seo: { ...prev.seo, metaTitle: e.target.value }
                  }))}
                  maxLength={60}
                  className="w-full px-4 py-3 border border-brand-grey-200 rounded-lg focus:outline-none focus:border-brand-yellow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">Meta Description</label>
                <textarea
                  value={formData.seo.metaDescription}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seo: { ...prev.seo, metaDescription: e.target.value }
                  }))}
                  rows={2}
                  maxLength={160}
                  className="w-full px-4 py-3 border border-brand-grey-200 rounded-lg focus:outline-none focus:border-brand-yellow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">Keywords</label>
                <input
                  type="text"
                  value={formData.seo.keywords}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seo: { ...prev.seo, keywords: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-brand-grey-200 rounded-lg focus:outline-none focus:border-brand-yellow"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-brand-grey-100">
            <Link
              href="/admin/blog"
              className="px-6 py-3 border border-brand-grey-200 text-brand-black rounded-lg hover:bg-brand-grey-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-brand-yellow text-brand-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
      </div>
    </AdminLayout>
  );
}