import axios from 'axios';

export const api = axios.create({
  baseURL: `${process.env.RENDER_API_URL}`,
  withCredentials: true,
});
