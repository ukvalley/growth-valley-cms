'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clientAPI } from '@/lib/admin-api';
import AdminLayout from '../AdminLayout';

interface Client {
  _id: string;
  name: string;
  logo: string;
  logoDark?: string;
  website?: string;
  industry?: string;
  featured: boolean;
  status: 'active' | 'inactive';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function ClientsAdminPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAll();
      if (response.success) {
        setClients(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await clientAPI.delete(id);
      if (response.success) {
        setClients(clients.filter(c => c._id !== id));
        setDeleteConfirm(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete client');
    }
  };

  const toggleStatus = async (client: Client) => {
    try {
      const response = await clientAPI.update(client._id, {
        status: client.status === 'active' ? 'inactive' : 'active'
      });
      if (response.success) {
        setClients(clients.map(c => 
          c._id === client._id ? { ...c, status: response.data.status } : c
        ));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  const toggleFeatured = async (client: Client) => {
    try {
      const response = await clientAPI.update(client._id, {
        featured: !client.featured
      });
      if (response.success) {
        setClients(clients.map(c => 
          c._id === client._id ? { ...c, featured: response.data.featured } : c
        ));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update featured status');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 text-brand-black dark:text-white mb-2">Client Logos</h1>
            <p className="text-body text-brand-grey-500 dark:text-brand-grey-400">
              Manage client/partner logos displayed on the homepage
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 border border-brand-grey-300 dark:border-brand-grey-700 text-brand-black dark:text-white rounded-lg hover:border-accent transition-colors"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/admin/clients/new"
              className="px-4 py-2 bg-accent text-brand-black font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              + Add Client
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="text-red-700 dark:text-red-400 hover:text-red-900">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="animate-pulse grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-brand-grey-200 dark:bg-brand-grey-800 rounded-lg"></div>
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 rounded-lg">
            <svg className="w-16 h-16 mx-auto text-brand-grey-300 dark:text-brand-grey-600 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <h3 className="text-heading-4 text-brand-black dark:text-white mb-2">No clients yet</h3>
            <p className="text-body text-brand-grey-500 dark:text-brand-grey-400 mb-4">
              Add client logos to display on your homepage
            </p>
            <Link
              href="/admin/clients/new"
              className="inline-flex px-4 py-2 bg-accent text-brand-black font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              Add First Client
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-brand-grey-50 dark:bg-brand-grey-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-grey-500 dark:text-brand-grey-400 uppercase tracking-wider">
                    Logo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-grey-500 dark:text-brand-grey-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-grey-500 dark:text-brand-grey-400 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-grey-500 dark:text-brand-grey-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-grey-500 dark:text-brand-grey-400 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-brand-grey-500 dark:text-brand-grey-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-grey-200 dark:divide-brand-grey-800">
                {clients.map((client) => (
                  <tr key={client._id} className="hover:bg-brand-grey-50 dark:hover:bg-brand-grey-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-10 bg-brand-grey-100 dark:bg-brand-grey-800 rounded flex items-center justify-center overflow-hidden">
                        {client.logo ? (
                          <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-xs text-brand-grey-400">No logo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-brand-black dark:text-white">{client.name}</div>
                      {client.website && (
                        <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
                          {client.website}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-grey-500 dark:text-brand-grey-400">
                      {client.industry || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(client)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          client.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}
                      >
                        {client.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleFeatured(client)}
                        className={`w-5 h-5 rounded border ${
                          client.featured
                            ? 'bg-accent border-accent text-brand-black'
                            : 'border-brand-grey-300 dark:border-brand-grey-600'
                        }`}
                      >
                        {client.featured && (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/clients/${client._id}`}
                          className="text-brand-grey-500 hover:text-accent transition-colors"
                        >
                          Edit
                        </Link>
                        {deleteConfirm === client._id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(client._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-brand-grey-500 hover:text-brand-grey-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(client._id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}