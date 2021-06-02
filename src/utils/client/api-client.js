import axios from 'axios';
import history from './history.js';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (error.response.status === 403) {
      // trigger toast notification
    }
    else if (error.response.status === 401) {
      // TODO: unset user (in case they *were* logged in)
      // TODO: remember the page they were on, and then redirect there after login
      history.push('/login');
      error.config._redirectPending = true;
    }

    return Promise.reject(error);
  }
);

export default apiClient;