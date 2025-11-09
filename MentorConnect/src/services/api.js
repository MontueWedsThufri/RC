const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Students API
export const studentsAPI = {
  getAll: () => apiCall('/students'),
  
  register: (studentData) => 
    apiCall('/students/register', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),
  
  login: (studentId) =>
    apiCall('/students/login', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    }),
  
  delete: (studentId) =>
    apiCall(`/students/${studentId}`, {
      method: 'DELETE',
    }),
};

// Mentors API
export const mentorsAPI = {
  getAll: () => apiCall('/mentors'),
  
  register: (mentorData) =>
    apiCall('/mentors/register', {
      method: 'POST',
      body: JSON.stringify(mentorData),
    }),
  
  login: (mentorId) =>
    apiCall('/mentors/login', {
      method: 'POST',
      body: JSON.stringify({ mentorId }),
    }),
  
  delete: (mentorId) =>
    apiCall(`/mentors/${mentorId}`, {
      method: 'DELETE',
    }),
};

// Messages API
export const messagesAPI = {
  getAll: () => apiCall('/messages'),
  
  send: (from, to, text) =>
    apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify({ from, to, text }),
    }),
  
  delete: (messageId) =>
    apiCall(`/messages/${messageId}`, {
      method: 'DELETE',
    }),
};

// Goals API
export const goalsAPI = {
  getAll: () => apiCall('/goals'),
  
  add: (title, userId) =>
    apiCall('/goals', {
      method: 'POST',
      body: JSON.stringify({ title, userId }),
    }),
  
  update: (id, updates) =>
    apiCall(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (id) =>
    apiCall(`/goals/${id}`, {
      method: 'DELETE',
    }),
};

// Requests API
export const requestsAPI = {
  getAll: () => apiCall('/requests'),
  
  create: (mentorId, studentId) =>
    apiCall('/requests', {
      method: 'POST',
      body: JSON.stringify({ mentorId, studentId }),
    }),
  
  updateStatus: (requestId, status) =>
    apiCall(`/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Ratings API
export const ratingsAPI = {
  getAll: () => apiCall('/ratings'),
  
  submit: (fromId, toId, rating, comment, fromRole, toRole) =>
    apiCall('/ratings', {
      method: 'POST',
      body: JSON.stringify({ fromId, toId, rating, comment, fromRole, toRole }),
    }),
};

// Sessions API
export const sessionsAPI = {
  getAll: () => apiCall('/sessions'),

  create: (sessionData) =>
    apiCall('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    }),
};

// AI Assistant API
export const aiAPI = {
  chat: (payload) =>
    apiCall('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
