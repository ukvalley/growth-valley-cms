'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { caseStudyAPI, mediaAPI } from '@/lib/admin-api';
import AdminLayout from '../../AdminLayout';

const industries = ['SaaS', 'E-commerce', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Real Estate', 'Technology', 'Other'];

interface Result {
  metric: string;
  value: string;
  description: string;
}

interface Testimonial {
  quote: string;
  author: string;
  designation: string;
  avatar: string;
}

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    industry: 'SaaS',
    clientName: '',
    clientLogo: '',
    featuredImage: '',
    challenge: '',
    solution: '',
    results: [{ metric: '', value: '', description: '' }] as Result[],
    timeline: '',
    technologies: '',
    testimonial: { quote: '', author: '', designation: '', avatar: '' } as Testimonial,
    featured: false,
    status: 'published',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'featuredImage' | 'clientLogo' | 'avatar') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploadingField = field === 'featuredImage' ? setUploading : field === 'clientLogo' ? setUploadingLogo : setUploadingAvatar;
    setUploadingField(true);

    try {
      const response = await mediaAPI.upload(file, 'case-studies');
      if (response.success) {
        if (field === 'avatar') {
          setFormData(prev => ({
            ...prev,
            testimonial: { ...prev.testimonial, avatar: response.data.url }
          }));
        } else {
          setFormData(prev => ({ ...prev, [field]: response.data.url }));
        }
      }
    } catch (error: any) {
      alert(error.message || 'Upload failed');
    } finally {
      setUploadingField(false);
    }
  };

  const addResult = () => {
    setFormData(prev => ({
      ...prev,
      results: [...prev.results, { metric: '', value: '', description: '' }]
    }));
  };

  const removeResult = (index: number) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }));
  };

  const updateResult = (index: number, field: keyof Result, value: string) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.map((r, i) => i === index ? { ...r, [field]: value } : r)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        results: formData.results.filter(r => r.metric && r.value),
        testimonial: formData.testimonial.quote ? formData.testimonial : undefined,
        seo: {
          metaTitle: formData.seo.metaTitle || formData.title,
          metaDescription: formData.seo.metaDescription || formData.challenge.substring(0, 160),
          keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(Boolean),
        },
        publishDate: formData.status === 'published' ? new Date() : undefined,
      };

      const response = await caseStudyAPI.create(data);
      if (response.success) {
        router.push('/admin/case-studies');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create case study');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/case-studies" className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors">
            ← Back to Case Studies
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-brand-black dark:text-white mb-8">Create New Case Study</h1>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData(prev => ({ ...prev, title, slug: prev.slug || generateSlug(title) }));
                      }}
                      required
                      className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                      placeholder="e.g., TechCorp: 3x Pipeline Growth"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                      pattern="[a-z0-9-]+"
                      className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                      placeholder="url-friendly-slug"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Industry *</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                    >
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Client Name *</label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                      placeholder="Company name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Images</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Featured Image</label>
                  <div className="border-2 border-dashed border-brand-grey-300 dark:border-brand-grey-700 rounded-lg p-4 text-center">
                    {formData.featuredImage ? (
                      <div className="relative">
                        <img src={formData.featuredImage} alt="Featured" className="w-full h-40 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'featuredImage')}
                          className="hidden"
                          id="featuredImage"
                        />
                        <label htmlFor="featuredImage" className="cursor-pointer">
                          <div className="text-brand-grey-500 dark:text-brand-grey-400">
                            {uploading ? 'Uploading...' : 'Click to upload featured image'}
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Client Logo */}
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Client Logo</label>
                  <div className="border-2 border-dashed border-brand-grey-300 dark:border-brand-grey-700 rounded-lg p-4 text-center">
                    {formData.clientLogo ? (
                      <div className="relative">
                        <img src={formData.clientLogo} alt="Client Logo" className="w-full h-40 object-contain rounded bg-white p-4" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, clientLogo: '' }))}
                          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'clientLogo')}
                          className="hidden"
                          id="clientLogo"
                        />
                        <label htmlFor="clientLogo" className="cursor-pointer">
                          <div className="text-brand-grey-500 dark:text-brand-grey-400">
                            {uploadingLogo ? 'Uploading...' : 'Click to upload client logo'}
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Content</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Challenge *</label>
                  <textarea
                    value={formData.challenge}
                    onChange={(e) => setFormData(prev => ({ ...prev, challenge: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                    placeholder="Describe the client's challenge or problem..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Solution *</label>
                  <textarea
                    value={formData.solution}
                    onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                    placeholder="Describe the solution you provided..."
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-brand-black dark:text-white">Results</h2>
                <button
                  type="button"
                  onClick={addResult}
                  className="px-4 py-2 bg-accent text-brand-black rounded-lg text-sm font-medium hover:bg-accent-light transition-colors"
                >
                  + Add Result
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.results.map((result, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-brand-grey-200 dark:border-brand-grey-700 rounded-lg">
                    <input
                      type="text"
                      value={result.metric}
                      onChange={(e) => updateResult(index, 'metric', e.target.value)}
                      placeholder="Metric (e.g., Revenue)"
                      className="px-3 py-2 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                    />
                    <input
                      type="text"
                      value={result.value}
                      onChange={(e) => updateResult(index, 'value', e.target.value)}
                      placeholder="Value (e.g., 3x growth)"
                      className="px-3 py-2 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                    />
                    <input
                      type="text"
                      value={result.description}
                      onChange={(e) => updateResult(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="md:col-span-2 px-3 py-2 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                    />
                    {formData.results.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResult(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Additional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Timeline</label>
                  <input
                    type="text"
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                    placeholder="e.g., 90 days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Technologies</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                    placeholder="HubSpot, Salesforce, Marketo (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Client Testimonial (Optional)</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Quote</label>
                  <textarea
                    value={formData.testimonial.quote}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      testimonial: { ...prev.testimonial, quote: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                    placeholder="Client testimonial quote..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Author Name</label>
                    <input
                      type="text"
                      value={formData.testimonial.author}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        testimonial: { ...prev.testimonial, author: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Designation</label>
                    <input
                      type="text"
                      value={formData.testimonial.designation}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        testimonial: { ...prev.testimonial, designation: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                      placeholder="VP of Marketing"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Author Avatar</label>
                  <div className="border-2 border-dashed border-brand-grey-300 dark:border-brand-grey-700 rounded-lg p-4 text-center">
                    {formData.testimonial.avatar ? (
                      <div className="relative inline-block">
                        <img src={formData.testimonial.avatar} alt="Avatar" className="w-20 h-20 object-cover rounded-full" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            testimonial: { ...prev.testimonial, avatar: '' }
                          }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'avatar')}
                          className="hidden"
                          id="testimonialAvatar"
                        />
                        <label htmlFor="testimonialAvatar" className="cursor-pointer">
                          <div className="text-brand-grey-500 dark:text-brand-grey-400">
                            {uploadingAvatar ? 'Uploading...' : 'Click to upload avatar'}
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white dark:bg-brand-grey-900 p-6 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800">
              <h2 className="text-lg font-semibold text-brand-black dark:text-white mb-4">Publishing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-5 h-5 rounded border-brand-grey-300 dark:border-brand-grey-600 text-accent focus:ring-accent"
                    />
                    <span className="text-sm font-medium text-brand-black dark:text-white">Mark as Featured</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/admin/case-studies"
                className="px-6 py-3 border border-brand-grey-200 dark:border-brand-grey-700 text-brand-black dark:text-white rounded-lg hover:bg-brand-grey-50 dark:hover:bg-brand-grey-800 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-accent text-brand-black font-semibold rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Case Study'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}