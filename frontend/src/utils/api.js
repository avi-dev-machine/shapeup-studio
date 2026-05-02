/**
 * API utility — fetch wrapper for backend communication.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Generic fetch wrapper with JSON handling and auth support.
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...options.headers,
  };

  // Add JSON content type unless it's FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('shapeup_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

// ── Public API ──────────────────────────────────────
export const api = {
  // Auth
  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Trainers
  getTrainers: () => apiFetch('/trainers'),

  // Owner
  getOwner: () => apiFetch('/owner'),

  // Packages
  getPackages: (category) =>
    apiFetch(`/packages${category ? `?category=${category}` : ''}`),

  // Hours
  getHours: () => apiFetch('/hours'),
  getAdmission: () => apiFetch('/admission'),

  // Reviews
  getReviews: () => apiFetch('/reviews'),
  submitReview: (data) =>
    apiFetch('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // Gallery
  getGallery: () => apiFetch('/gallery'),

  // Branches
  getBranches: () => apiFetch('/branches'),

  // Logo
  getLogo: () => apiFetch('/logo'),

  // Videos
  getVideos: () => apiFetch('/videos'),

  // Programs
  getPrograms: () => apiFetch('/programs'),

  // Health
  health: () => apiFetch('/health'),
};

// ── Admin API ───────────────────────────────────────
export const adminApi = {
  // Trainers
  createTrainer: (data) =>
    apiFetch('/admin/trainers', { method: 'POST', body: JSON.stringify(data) }),
  updateTrainer: (id, data) =>
    apiFetch(`/admin/trainers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrainer: (id) =>
    apiFetch(`/admin/trainers/${id}`, { method: 'DELETE' }),

  // Owner
  updateOwner: (data) =>
    apiFetch('/admin/owner', { method: 'PUT', body: JSON.stringify(data) }),

  // Packages
  createPackage: (data) =>
    apiFetch('/admin/packages', { method: 'POST', body: JSON.stringify(data) }),
  updatePackage: (id, data) =>
    apiFetch(`/admin/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePackage: (id) =>
    apiFetch(`/admin/packages/${id}`, { method: 'DELETE' }),

  // Hours
  updateHours: (id, data) =>
    apiFetch(`/admin/hours/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateAdmission: (id, data) =>
    apiFetch(`/admin/admission/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Reviews
  deleteReview: (id) =>
    apiFetch(`/admin/reviews/${id}`, { method: 'DELETE' }),

  // Gallery
  addGalleryItem: (data) =>
    apiFetch('/admin/gallery', { method: 'POST', body: JSON.stringify(data) }),
  deleteGalleryItem: (id) =>
    apiFetch(`/admin/gallery/${id}`, { method: 'DELETE' }),

  // Branches
  createBranch: (data) =>
    apiFetch('/admin/branches', { method: 'POST', body: JSON.stringify(data) }),
  updateBranch: (id, data) =>
    apiFetch(`/admin/branches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBranch: (id) =>
    apiFetch(`/admin/branches/${id}`, { method: 'DELETE' }),

  // Videos
  createVideo: (data) =>
    apiFetch('/admin/videos', { method: 'POST', body: JSON.stringify(data) }),
  updateVideo: (id, data) =>
    apiFetch(`/admin/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVideo: (id) =>
    apiFetch(`/admin/videos/${id}`, { method: 'DELETE' }),

  // Programs
  createProgram: (data) =>
    apiFetch('/admin/programs', { method: 'POST', body: JSON.stringify(data) }),
  updateProgram: (id, data) =>
    apiFetch(`/admin/programs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProgram: (id) =>
    apiFetch(`/admin/programs/${id}`, { method: 'DELETE' }),

  // Gym Hours
  createGymHour: (data) =>
    apiFetch('/admin/hours', { method: 'POST', body: JSON.stringify(data) }),
  updateGymHour: (id, data) =>
    apiFetch(`/admin/hours/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGymHour: (id) =>
    apiFetch(`/admin/hours/${id}`, { method: 'DELETE' }),

  // Logo
  updateLogo: (logoUrl) =>
    apiFetch('/admin/logo', { method: 'PUT', body: JSON.stringify({ logo_url: logoUrl }) }),

  // Upload
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch('/admin/upload', { method: 'POST', body: formData });
  },
};

export const getUploadUrl = (path) => {
  if (!path) return '';
  // Only allow full URLs (Cloudinary)
  if (path.startsWith('http')) return path;
  // Ignore any local /uploads/ paths as they are dead on Render
  return '';
};
