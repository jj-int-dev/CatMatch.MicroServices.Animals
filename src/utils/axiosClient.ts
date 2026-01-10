import config from '../config/config';
import axios from 'axios';

export const axiosGeoapifyClient = axios.create({
  baseURL: config.GEOAPIFY_BASE_API_URL,
  timeout: 30000,
  params: {
    apiKey: config.GEOAPIFY_API_KEY
  }
});
