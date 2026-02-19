// Admin API utility functions

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Token management
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminUser', JSON.stringify(user));
  }
};

// API request helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }

  return data;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.success) {
      setToken(data.data.accessToken);
      setUser(data.data.admin);
    }
    return data;
  },

  logout: async () => {
    try {
      await apiRequest('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // Ignore logout errors
    }
    removeToken();
  },

  getProfile: async () => {
    return apiRequest('/api/admin/me');
  },
};

// Blog API
export const blogAPI = {
  getAll: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    return apiRequest(`/api/blog/admin/all?${params}`);
  },

  getBySlug: async (slug: string) => {
    return apiRequest(`/api/blog/${slug}`);
  },

  create: async (data: any) => {
    return apiRequest('/api/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/api/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/api/blog/${id}`, { method: 'DELETE' });
  },
};

// Case Studies API
export const caseStudyAPI = {
  getAll: async (page = 1, limit = 10) => {
    return apiRequest(`/api/case-studies/admin/all?page=${page}&limit=${limit}`);
  },

  getBySlug: async (slug: string) => {
    return apiRequest(`/api/case-studies/${slug}`);
  },

  create: async (data: any) => {
    return apiRequest('/api/case-studies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/api/case-studies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/api/case-studies/${id}`, { method: 'DELETE' });
  },
};

// Enquiries API
export const enquiryAPI = {
  getAll: async (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    return apiRequest(`/api/contact?${params}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/api/contact/${id}`);
  },

  updateStatus: async (id: string, data: any) => {
    return apiRequest(`/api/contact/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  addNote: async (id: string, content: string) => {
    return apiRequest(`/api/contact/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/api/contact/${id}`, { method: 'DELETE' });
  },

  getStats: async () => {
    return apiRequest('/api/contact/stats');
  },
};

// Settings API
export const settingsAPI = {
  get: async () => {
    return apiRequest('/api/settings');
  },

  update: async (data: any) => {
    return apiRequest('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return apiRequest('/api/admin/dashboard');
  },
};

// Media API
export const mediaAPI = {
  getAll: async (page = 1, limit = 30) => {
    return apiRequest(`/api/media?page=${page}&limit=${limit}`);
  },

  upload: async (file: File, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = getToken();
    const response = await fetch(`${API_URL}/api/media`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },

  delete: async (id: string) => {
    return apiRequest(`/api/media/${id}`, { method: 'DELETE' });
  },
};

// Team API
export const teamAPI = {
  getAll: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return apiRequest(`/api/team${params}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/api/team/${id}`);
  },

  create: async (data: any) => {
    return apiRequest('/api/team', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/api/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/api/team/${id}`, { method: 'DELETE' });
  },

  reorder: async (orders: { id: string; order: number }[]) => {
    return apiRequest('/api/team/reorder', {
      method: 'PUT',
      body: JSON.stringify({ orders }),
    });
  },
};

// Testimonials API
export const testimonialAPI = {
  getAll: async (page = 1, limit = 20) => {
    return apiRequest(`/api/testimonials/admin/all?page=${page}&limit=${limit}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/api/testimonials/${id}`);
  },

  create: async (data: any) => {
    return apiRequest('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/api/testimonials/${id}`, { method: 'DELETE' });
  },

  reorder: async (orders: { id: string; order: number }[]) => {
    return apiRequest('/api/testimonials/reorder', {
      method: 'PUT',
      body: JSON.stringify({ orders }),
    });
  },
};

// Content API - CMS for managing page content
export const contentAPI = {
  // Get all pages
  getAllPages: async () => {
    return apiRequest('/api/content');
  },

  // Get content for a specific page
  getPageContent: async (page: string) => {
    return apiRequest(`/api/content/${page}`);
  },

  // Get specific section from a page
  getSectionContent: async (page: string, section: string) => {
    return apiRequest(`/api/content/${page}/${section}`);
  },

  // Get page structure/schema
  getPageStructure: async (page: string) => {
    return apiRequest(`/api/content/${page}/structure`);
  },

  // Update entire page content
  updatePageContent: async (page: string, data: { sections?: any; seo?: any }) => {
    return apiRequest(`/api/content/${page}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Update specific section on a page
  updateSectionContent: async (page: string, section: string, content: any) => {
    return apiRequest(`/api/content/${page}/${section}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  },

  // Delete a section from a page
  deleteSectionContent: async (page: string, section: string) => {
    return apiRequest(`/api/content/${page}/${section}`, { method: 'DELETE' });
  },

  // Update SEO for a page
  updateSEO: async (page: string, seo: any) => {
    return apiRequest(`/api/content/${page}/seo`, {
      method: 'PUT',
      body: JSON.stringify(seo),
    });
  },

  // Reset page content to defaults
  resetPageContent: async (page: string) => {
    return apiRequest(`/api/content/${page}/reset`, { method: 'POST' });
  },

  // Initialize default content for all pages
  initializeDefaults: async () => {
    return apiRequest('/api/content/initialize', { method: 'POST' });
  },
};