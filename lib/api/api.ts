import axios from 'axios';
// import { refreshSession } from './clientApi';

export const nextServer = axios.create({
  baseURL: `${process.env.NEXT_API_URL}/api`,
  withCredentials: true,
});

// nextServer.interceptors.response.use(
//   res => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (originalRequest.url === '/auth/refresh') {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await refreshSession();
//         return nextServer(originalRequest);
//       } catch (e) {
//         window.location.href = '/auth/login';
//       }
//     }

//     return Promise.reject(error);
//   }
// );
