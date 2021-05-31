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
    console.log({ axiosResponse: response })
    return response;
  }, function (error) {
    if (error.response.status === 403) {
      console.log('****** PERMISSION ERROR ********');

    }
    else if (error.response.status === 401) {
      console.log('++++++++ not logged in ++++++++');
      history.push('/login');
    }
    console.log({ axiosErrorResponse: error })
    return error;
    return Promise.reject(error);
  }
);

export default apiClient;