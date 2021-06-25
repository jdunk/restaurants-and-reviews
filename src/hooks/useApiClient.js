import { useAuth } from './auth';
import { useSnackbar } from './snackbar';
import apiClient from '../utils/client/api-client';
import history from '../utils/client/history.js';

let interceptorsAdded = false;

export function useApiClient() {
  const { auth } = useAuth();
  const { trigger: triggerSnackbar } = useSnackbar();

  if (!interceptorsAdded) {
    apiClient.interceptors.response.use(function (response) {
        return response;
      }, function (error) {
        console.log({ interceptorError: error })
        if (error.response.status === 403) {
          triggerSnackbar({ messageType: 403 });
        }
        else if (error.response.status === 401) {
          // Unset user (in the case were they *were* logged in)
          auth.setUser(false);

          history.push('/login', { nonAuthUri: history.location.pathname });
          error.config._redirectPending = true;
        }
        else if ([500, 503].includes(error.response.status)) {
          triggerSnackbar({ messageType: 500 });
        }

        return Promise.reject(error);
      }
    );

    interceptorsAdded = true;
  }

  return {
    apiClient,
  };
};