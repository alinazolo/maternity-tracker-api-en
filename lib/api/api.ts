import axios from 'axios';
// import { refreshSession } from './clientApi';

// In the browser the API is on the same origin, so a relative path is enough.
// On the server (serverApi.ts) an absolute URL is required.
export const nextServer = axios.create({
  baseURL: "/api",
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
