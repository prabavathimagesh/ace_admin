import api from "../axios";

/* ============================================================
   COMMON WRAPPER (same as apiClient.js style)
   ============================================================ */
async function wrap(promise) {
  try {
    const res = await promise;
    return res;
  } catch (err) {
    return {
      status: false,
      message: err.response?.data?.message || "Something went wrong",
      code: err.response?.status || 500,
    };
  }
}
/* ============================================================
   EVENT TYPE (FORM-DATA BASED) ✅
   ============================================================ */

// LIST
export const fetchEventTypesApi = () => {
  return wrap(api.get("/v1/master/event-types"));
};

// CREATE (form-data)
export const createEventTypeApi = (formData) => {
  return wrap(
    api.post("/v1/master/event-types", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
};

// UPDATE (form-data)
export const updateEventTypeApi = (identity, formData) => {
  return wrap(
    api.put(`/v1/master/event-types/${identity}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
};

// DELETE
export const deleteEventTypeApi = (identity) => {
  return wrap(api.delete(`/v1/master/event-types/${identity}`));
};

/* =======================
   LOCATION – COUNTRY
======================= */
export const fetchCountriesApi = () => wrap(api.get("/v1/location/countries"));

export const fetchCountryApi = (id) =>
  wrap(api.get(`/v1/location/countries/${id}`));

export const createCountryApi = (data) =>
  wrap(api.post("/v1/location/countries", data));

export const bulkCreateCountriesApi = (data) =>
  wrap(api.post("/v1/location/countries/bulk", data));

export const updateCountryApi = (id, data) =>
  wrap(api.put(`/v1/location/countries/${id}`, data));

export const deleteCountryApi = (id) =>
  wrap(api.delete(`/v1/location/countries/${id}`));

/* =======================
   LOCATION – STATE
======================= */
export const fetchStatesApi = () => wrap(api.get("/v1/location/states"));

export const fetchStateApi = (id) => wrap(api.get(`/v1/location/states/${id}`));

export const fetchStatesByCountryApi = (countryId) =>
  wrap(api.get(`/v1/location/countries/${countryId}/states`));

export const createStateApi = (countryId, data) =>
  wrap(api.post(`/v1/location/countries/${countryId}/states`, data));

export const bulkCreateStatesApi = (countryId, data) =>
  wrap(api.post(`/v1/location/countries/${countryId}/states/bulk`, data));

export const updateStateApi = (id, data) =>
  wrap(api.put(`/v1/location/states/${id}`, data));

export const deleteStateApi = (id) =>
  wrap(api.delete(`/v1/location/states/${id}`));

/* =======================
   LOCATION – CITY
======================= */
export const fetchCitiesApi = () => wrap(api.get("/v1/location/cities"));

export const fetchCityApi = (id) => wrap(api.get(`/v1/location/cities/${id}`));

export const fetchCitiesByStateApi = (stateId) =>
  wrap(api.get(`/v1/location/states/${stateId}/cities`));

export const createCityApi = (stateId, data) =>
  wrap(api.post(`/v1/location/states/${stateId}/cities`, data));

export const bulkCreateCitiesApi = (stateId, data) =>
  wrap(api.post(`/v1/location/states/${stateId}/cities/bulk`, data));

export const updateCityApi = (id, data) =>
  wrap(api.put(`/v1/location/cities/${id}`, data));

export const deleteCityApi = (id) =>
  wrap(api.delete(`/v1/location/cities/${id}`));

/* ============================================================
   GENERIC MASTER CRUD (🔥 CORE)
   ============================================================ */

/**
 * GET ALL
 * @param {string} path - api path (ex: /event-types)
 */
export const fetchMasterListApi = (path) => {
  return wrap(api.get(`/v1/admin${path}`));
};

/**
 * CREATE
 */
export const createMasterApi = (path, data) => {
  return wrap(api.post(`/v1/admin${path}`, data));
};

/**
 * UPDATE
 */
export const updateMasterApi = (path, identity, data) => {
  return wrap(api.put(`/v1/admin${path}/${identity}`, data));
};

/**
 * DELETE
 */
export const deleteMasterApi = (path, identity) => {
  return wrap(api.delete(`/v1/admin${path}/${identity}`));
};

// PERKS
export const fetchPerksApi = () => {
  return wrap(api.get("/v1/master/perks"));
};

export const createPerkApi = (data) => {
  return wrap(api.post("/v1/master/perks", data));
};

export const updatePerkApi = (identity, data) => {
  return wrap(api.put(`/v1/master/perks/${identity}`, data));
};

export const deletePerkApi = (identity) => {
  return wrap(api.delete(`/v1/master/perks/${identity}`));
};

// CERTIFICATION
export const fetchCertificationsApi = () => {
  return wrap(api.get("/v1/master/certifications"));
};

export const createCertificationApi = (data) => {
  return wrap(api.post("/v1/master/certifications", data));
};

export const updateCertificationApi = (identity, data) => {
  return wrap(api.put(`/v1/master/certifications/${identity}`, data));
};

export const deleteCertificationApi = (identity) => {
  return wrap(api.delete(`/v1/master/certifications/${identity}`));
};

// ACCOMMODATION
export const fetchAccommodationsApi = () => {
  return wrap(api.get("/v1/master/accommodations"));
};

export const createAccommodationApi = (data) => {
  return wrap(api.post("/v1/master/accommodations", data));
};

export const updateAccommodationApi = (identity, data) => {
  return wrap(api.put(`/v1/master/accommodations/${identity}`, data));
};

export const deleteAccommodationApi = (identity) => {
  return wrap(api.delete(`/v1/master/accommodations/${identity}`));
};

// ORG CATEGORIES
export const fetchOrgCategoriesApi = () => {
  return wrap(api.get("/v1/master/org-categories"));
};

export const createOrgCategoryApi = (data) => {
  return wrap(api.post("/v1/master/org-categories", data));
};

export const updateOrgCategoryApi = (identity, data) => {
  return wrap(api.put(`/v1/master/org-categories/${identity}`, data));
};

export const deleteOrgCategoryApi = (identity) => {
  return wrap(api.delete(`/v1/master/org-categories/${identity}`));
};

// DEPARTMENTS
export const fetchDepartmentsApi = () => {
  return wrap(api.get("/v1/master/departments"));
};

export const createDepartmentApi = (data) => {
  return wrap(api.post("/v1/master/departments", data));
};

export const updateDepartmentApi = (identity, data) => {
  return wrap(api.put(`/v1/master/departments/${identity}`, data));
};

export const deleteDepartmentApi = (identity) => {
  return wrap(api.delete(`/v1/master/departments/${identity}`));
};

// FAQ
export const fetchFaqsApi = () => {
  return wrap(api.get("/v1/master/faqs"));
};

export const createFaqApi = (data) => {
  return wrap(api.post("/v1/master/faqs", data));
};

export const updateFaqApi = (identity, data) => {
  return wrap(api.put(`/v1/master/faqs/${identity}`, data));
};

export const deleteFaqApi = (identity) => {
  return wrap(api.delete(`/v1/master/faqs/${identity}`));
};

/* ============================================================
   MASTER PATH CONSTANTS (🔥 IMPORTANT)
   ============================================================ */

export const MASTER_PATHS = {
  EVENT_TYPE: "/event-types",
  EVENT_CATEGORY: "/event-categories",
  ORG_CATEGORY: "/org-categories",
  DEPARTMENT: "/departments",
  EVENT_MODE: "/event-modes",
  PERKS: "/perks",
  CERTIFICATION: "/certifications",
  ACCOMMODATION: "/accommodations",
  EVENT_HOST: "/event-hosts",

  // test
  // LOCATION
  COUNTRY: "/countries",
  STATE: "/states",
  CITY: "/cities",

  // CONTENT
  FAQ: "/faqs",
  PRIVACY_POLICY: "/privacy-policies",
  TERMS: "/terms",
};
