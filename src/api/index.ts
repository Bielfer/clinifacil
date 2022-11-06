import { auth } from '@/services/firebase';
import axios from 'axios';

const api = axios;
const apiWithToken = axios;

api.defaults.baseURL = `${process.env.NEXT_PUBLIC_APP_URL}/api`;
apiWithToken.defaults.baseURL = `${process.env.NEXT_PUBLIC_APP_URL}/api`;

apiWithToken.interceptors.request.use(async (config) => {
  const newConfig = { ...config };
  const token = await auth.currentUser?.getIdToken();

  if (!newConfig.headers) return null;

  newConfig.headers.authorization = `Bearer ${token}`;

  return newConfig;
});

export { api, apiWithToken };
