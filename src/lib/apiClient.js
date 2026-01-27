import api from "./axios";

// Standard wrapper to return consistent response
async function wrap(promise) {
  try {
    const res = await promise;
    return res;
  } catch (err) {
    return {
      status: false,
      message: err.response?.data?.message || "Something went wrong",
      status: err.response?.status || 500,
    };
  }
}

/* ============================================================
   ORGANIZATION API
   ============================================================ */

// Fetch all organizations
export const fetchOrganizationsApi = () => {
  return wrap(api.get("/v1/admin/organizations/"));
};

export const createOrganizationApi = (data) => {
  return wrap(api.post("/v1/admin/organization", data));
};

// Fetch single organization (correct naming)
export const fetchSingleOrganizationApi = (orgId) => {
  return wrap(api.get(`/v1/admin/organizations/${orgId}`));
};

// Fetch all events of a specific organization
export const fetchEventsByOrganizationIdApi = (orgId) => {
  return wrap(api.get(`/v1/admin/organizations/${orgId}/events`));
};

// Update organization
export const updateOrganizationApi = (orgId, data) => {
  return wrap(api.put(`/v1/admin/organizations/${orgId}`, data));
};

// Delete organization
export const deleteOrganizationApi = (orgId) => {
  return wrap(api.delete(`/v1/admin/organizations/${orgId}`));
};

/* ============================================================
   EVENT API
   ============================================================ */

// Fetch all events
export const fetchEventsApi = () => {
  return wrap(api.get("/v1/admin/events"));
};

// Fetch single event by ID
export const fetchEventByIdApi = (eventId) => {
  return wrap(api.get(`/v1/admin/events/${eventId}`));
};

export const adminGetEventByIdApi = (orgId, eventId) => {
  return wrap(api.get(`/v1/admin/organizations/${orgId}/events/${eventId}`));
};

// Create event under organization
export const createEventApi = (orgId, data) => {
  return wrap(api.post(`/v1/admin/organizations/${orgId}/events`, data));
};

// Update event
export const updateEventApi = (orgId, eventId, data) => {
  return wrap(api.put(`/v1/admin/organizations/${orgId}/events/${eventId}`, data));
};

// Delete event
export const deleteEventApi = (orgId, eventId) => {
  return wrap(api.delete(`/v1/admin/organizations/${orgId}/events/${eventId}`));
};

// UPDATE EVENT STATUS
export const updateEventStatusApi = async (eventId, status) => {
  return await api.put(`/v1/admin/event/${eventId}/status`, { status });
};


/* ============================================================
   USER API
   ============================================================ */

// Fetch all users
export const fetchUsersApi = () => {
  return wrap(api.get("/v1/admin/users"));
};

// Fetch single user
export const fetchUserByIdApi = (userId) => {
  return wrap(api.get(`/v1/admin/users/${userId}`));
};

// Create user
export const createUserApi = (data) => {
  return wrap(api.post("/v1/admin/user", data));
};

// Update user
export const updateUserApi = (id, data) => {
  return wrap(api.put(`/v1/admin/user/${id}`, data));
};

// Delete user
export const deleteUserApi = (id) => {
  return wrap(api.delete(`/v1/admin/user/${id}`));
};
