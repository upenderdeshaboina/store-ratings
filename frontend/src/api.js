import axios from 'axios';

// Create a dedicated Axios instance for our API
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
});

// Add an interceptor that adds the JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/**
 * == Authentication API Calls ==
 */

/** @param {object} credentials - { email, password } */
export const login = (credentials) => API.post('/auth/login', credentials);

/** @param {object} userData - { name, email, address, password } */
export const signup = (userData) => API.post('/auth/signup', userData);

/** @param {string} newPassword */
export const updatePassword = (newPassword) => API.put('/auth/update-password', { password: newPassword });

/** @param {object} passwordData - { old_password, new_password } */
export const changePassword = (passwordData) => API.put('/auth/change-password', passwordData);

/**
 * == Dashboard API Calls ==
 */
export const getAdminDashboard = () => API.get('/dashboard');

/**
 * == User Management API Calls (Admin) ==
 */

/** @param {object} params - { name, email, address, role } */
export const getUsers = (params) => API.get('/users', { params });

/** @param {object} userData - The new user's data */
export const createUser = (userData) => API.post('/users', userData);

/**
 * == Store API Calls ==
 */

/** @param {object} params - { name, address } */
export const getStores = (params) => API.get('/stores', { params });

/** @param {object} storeData - The new store's data */
export const createStore = (storeData) => API.post('/stores', storeData);

/** @param {number} id - The ID of the store */
export const getStoreDetails = (id) => API.get(`/stores/${id}`);

/** Fetches the store belonging to the currently authenticated store_owner */
export const getMyStore = () => API.get('/stores/my-store');

/**
 * == Rating API Calls ==
 */

/** @param {object} ratingData - { store_id, rating } */
export const submitRating = (ratingData) => API.post('/ratings', ratingData);

/** Fetches all stores with the current user's rating for each */
export const getUserRatings = () => API.get('/ratings/user');

/** Fetches all ratings (Admin only) */
export const getAllRatings = () => API.get('/ratings');
