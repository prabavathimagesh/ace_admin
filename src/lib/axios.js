import axios from "axios";

const api = axios.create({
  baseURL: "https://api.allcollegeeventz.com/api",
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjozMCwiaWRlbnRpdHkiOiJiYzFlMDE2OS1hOWZmLTQxNzYtYmRhYy00OTlkODY4YTNjMzciLCJlbWFpbCI6InNpdmFyYW5qaTU2NzBAZ21haWwuY29tIiwicm9sZUlkIjoiMTA3YTA5ODQtODA3MC00YzIzLWFhYTgtMDY5MmI5MGI1N2QzIiwidHlwZSI6InVzZXIifSwiaWF0IjoxNzY5NDUwMjg2LCJleHAiOjE3NzAwNTUwODZ9.HcL9Wxabi5_CIWDMczgeOCc9H_aCqbwQqyVO4SbX-5c";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // FIX
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
