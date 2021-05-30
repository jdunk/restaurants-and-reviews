import axios from 'axios'

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
    console.log({ axiosErrorResponse: error })
    return Promise.reject(error);
  }
);

export default apiClient;