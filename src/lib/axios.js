import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-allcollegeevent-version-1.onrender.com/api",
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJpZGVudGl0eSI6ImJjNzNlMWQwLWFlYTAtNGQzZS05MjUyLWYxOGIxZWU5Mjc4MCIsImVtYWlsIjoiZ29waUBzcGFneWxvLmNvbSIsInJvbGVJZCI6IjU2MGRlNWY2LTRlODAtNDEyOC05ZWMzLTdhMzc3NmUzZmY3YyIsInR5cGUiOiJvcmcifSwiaWF0IjoxNzY5NTEwMTI2LCJleHAiOjE3NzAxMTQ5MjZ9.E4U8iK6eJ7mf_i5hAO_Jvkozfi6GcDHNlRZN7yQBcrg";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // FIX
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
