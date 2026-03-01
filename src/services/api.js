import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const propertyService = {
  getProperties:    (filters = {}) => api.get('/properties', { params: filters }),
  getProperty:      (id)           => api.get(`/properties/${id}`),
  getStats:         ()             => api.get('/properties/stats'),
  getDashboardStats:()             => api.get('/properties/dashboard-stats'),
  createProperty:   (data)         => api.post('/properties', data),
  updateProperty:   (id, data)     => api.put(`/properties/${id}`, data),
  deleteProperty:   (id)           => api.delete(`/properties/${id}`),
};

export const inquiryService = {
  getInquiries:        ()           => api.get('/inquiries'),
  createInquiry:       (data)       => api.post('/inquiries', data),
  updateInquiryStatus: (id, status) => api.put(`/inquiries/${id}`, { status }),
  deleteInquiry:       (id)         => api.delete(`/inquiries/${id}`),
  retrySync:           (id)         => api.post(`/inquiries/${id}/sync`),
};

export const authService = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe:    ()     => api.get('/auth/me'),
};

export const userService = {
  updatePreferences: (data) => api.put('/auth/preferences', data),
};

export const aboutService = {
  getAboutContent:    ()     => api.get('/about'),
  updateAboutContent: (data) => api.post('/about', data),
};

export const partnerService = {
  getPartners:   ()           => api.get('/partners'),
  addPartner:    (data)       => api.post('/partners', data),
  deletePartner: (id)         => api.delete(`/partners/${id}`),
};

export const categoryService = {
  getCategories:  ()           => api.get('/categories'),
  addCategory:    (data)       => api.post('/categories', data),
  updateCategory: (id, data)   => api.put(`/categories/${id}`, data),
  deleteCategory: (id)         => api.delete(`/categories/${id}`),
};

export const contactService = {
  getContactContent:    ()     => api.get('/contact'),
  updateContactContent: (data) => api.put('/contact', data),
};

export const testimonialService = {
  getTestimonials:    (all = false) => api.get('/testimonials', { params: all ? { all: 'true' } : {} }),
  addTestimonial:     (data)        => api.post('/testimonials', data),
  updateTestimonial:  (id, data)    => api.put(`/testimonials/${id}`, data),
  deleteTestimonial:  (id)          => api.delete(`/testimonials/${id}`),
};

export const zohoService = {
  subscribe: (webhookUrl) => api.post('/auth/zoho/subscribe', { webhookUrl }),
};

export default api;
