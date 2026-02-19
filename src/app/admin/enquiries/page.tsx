'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { enquiryAPI } from '@/lib/admin-api';
import { useAuth } from '@/lib/auth-context';
import AdminLayout from '../AdminLayout';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  message: string;
  status: string;
  source: string;
  createdAt: string;
  notes?: { content: string; createdAt: string }[];
}

export default function EnquiriesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isAuthenticated) loadEnquiries();
  }, [isAuthenticated, status]);

  const loadEnquiries = async () => {
    try {
      const response = await enquiryAPI.getAll(1, 50, status);
      setEnquiries(response.data || []);
    } catch (error) {
      console.error('Failed to load enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await enquiryAPI.updateStatus(id, { status: newStatus });
      loadEnquiries();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const addNote = async (id: string) => {
    if (!note.trim()) return;
    try {
      await enquiryAPI.addNote(id, note);
      setNote('');
      loadEnquiries();
    } catch (error) {
      alert('Failed to add note');
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await enquiryAPI.delete(id);
      loadEnquiries();
      setSelectedEnquiry(null);
    } catch (error) {
      alert('Failed to delete enquiry');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin" className="text-brand-grey-500 dark:text-brand-grey-400 hover:text-brand-black dark:hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-black dark:text-white">Enquiries</h1>
            <p className="text-brand-grey-500 dark:text-brand-grey-400 mt-1">{enquiries.length} total</p>
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-900 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-brand-grey-900 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-black dark:border-white mx-auto"></div>
                </div>
              ) : enquiries.length === 0 ? (
                <div className="p-8 text-center text-brand-grey-500 dark:text-brand-grey-400">No enquiries found</div>
              ) : (
                <div className="divide-y divide-brand-grey-200 dark:divide-brand-grey-700">
                  {enquiries.map((enquiry) => (
                    <div
                      key={enquiry._id}
                      className={`p-4 hover:bg-brand-grey-50 dark:hover:bg-brand-grey-800 cursor-pointer ${
                        selectedEnquiry?._id === enquiry._id ? 'bg-brand-grey-50 dark:bg-brand-grey-800' : ''
                      }`}
                      onClick={() => setSelectedEnquiry(enquiry)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-brand-black dark:text-white">{enquiry.name}</span>
                          <span className="text-brand-grey-500 dark:text-brand-grey-400 ml-2">{enquiry.company}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          enquiry.status === 'new' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                          enquiry.status === 'contacted' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                          enquiry.status === 'qualified' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          'bg-grey-100 dark:bg-brand-grey-700 text-brand-grey-700 dark:text-brand-grey-300'
                        }`}>
                          {enquiry.status}
                        </span>
                      </div>
                      <p className="text-sm text-brand-grey-500 dark:text-brand-grey-400 truncate">{enquiry.message}</p>
                      <p className="text-xs text-brand-grey-400 dark:text-brand-grey-500 mt-2">
                        {new Date(enquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedEnquiry ? (
              <div className="bg-white dark:bg-brand-grey-900 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800 p-6 sticky top-8">
                <h3 className="font-semibold text-brand-black dark:text-white mb-4">Enquiry Details</h3>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs text-brand-grey-400 dark:text-brand-grey-500">Name</p>
                    <p className="text-brand-black dark:text-white">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-grey-400 dark:text-brand-grey-500">Email</p>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-accent hover:underline">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-brand-grey-400 dark:text-brand-grey-500">Company</p>
                    <p className="text-brand-black dark:text-white">{selectedEnquiry.company}</p>
                  </div>
                  {selectedEnquiry.phone && (
                    <div>
                      <p className="text-xs text-brand-grey-400 dark:text-brand-grey-500">Phone</p>
                      <a href={`tel:${selectedEnquiry.phone}`} className="text-brand-black dark:text-white hover:underline">
                        {selectedEnquiry.phone}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-brand-grey-400 dark:text-brand-grey-500">Message</p>
                    <p className="text-brand-black dark:text-white whitespace-pre-wrap">{selectedEnquiry.message}</p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Update Status</label>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => updateStatus(selectedEnquiry._id, e.target.value)}
                    className="w-full px-4 py-2 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Add Note */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-brand-black dark:text-white mb-2">Add Note</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-brand-grey-200 dark:border-brand-grey-700 bg-white dark:bg-brand-grey-800 text-brand-black dark:text-white rounded-lg focus:outline-none focus:border-accent text-sm"
                    placeholder="Add a note..."
                  />
                  <button
                    onClick={() => addNote(selectedEnquiry._id)}
                    className="mt-2 px-4 py-2 bg-brand-grey-100 dark:bg-brand-grey-700 text-brand-black dark:text-white rounded-lg hover:bg-brand-grey-200 dark:hover:bg-brand-grey-600 text-sm"
                  >
                    Add Note
                  </button>
                </div>

                {/* Notes */}
                {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-brand-black dark:text-white mb-2">Notes</h4>
                    <div className="space-y-2">
                      {selectedEnquiry.notes.map((n, i) => (
                        <div key={i} className="text-sm bg-brand-grey-50 dark:bg-brand-grey-800 p-2 rounded text-brand-black dark:text-white">
                          {n.content}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => deleteEnquiry(selectedEnquiry._id)}
                  className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 text-sm"
                >
                  Delete Enquiry
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-brand-grey-900 rounded-lg border border-brand-grey-200 dark:border-brand-grey-800 p-6 text-center text-brand-grey-500 dark:text-brand-grey-400">
                Select an enquiry to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}