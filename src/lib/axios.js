import axios from "axios";

const api = axios.create({
  baseURL: "http://13.202.253.116:5000/api",
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo1LCJpZGVudGl0eSI6IjhhMmM5YzI3LWVmOTMtNGI0Mi1iMzUzLTE3NTQxZDYyYWEyNyIsImVtYWlsIjoiZ29waUBnbWFpbC5jb20iLCJyb2xlSWQiOiIyMzEwYmM0Zi1jZWI2LTQxNzItOGZmZS0xMmRkMWZmODMzMzIiLCJ0eXBlIjoidXNlciJ9LCJpYXQiOjE3NzIwOTc5ODksImV4cCI6MTc3MjcwMjc4OX0.5LtK0ehUR08fjBtKLe3ZWXswmSriGV22rA9U8VWixi4";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // FIX
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
