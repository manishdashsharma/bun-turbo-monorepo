import axios from 'axios';
import { env } from './env.js';

export const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

export const unwrap = (response) => response.data?.data ?? null;

export const apiErrorMessage = (error) => {
  if (error?.response) {
    return error.response.data?.message ?? 'Something went wrong on our side. Please try again.';
  }
  if (error?.request) {
    return 'Can’t reach the server right now. Check your connection and try again.';
  }
  return error?.message ?? 'Something went wrong. Please try again.';
};
