"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createEventApi,
  updateEventApi,
  adminGetEventByIdApi,
  fetchOrganizationsApi,
} from "../../../../lib/apiClient";
import { fetchMasterListApi, MASTER_PATHS } from "../../../../lib/api/master.api.js";
import {
  BTN_BACK,
  CONDITION_CREATE_EVENT,
  CONDITION_EDIT_EVENT,
  CONDITION_UPDATE_EVENT,
  EVENT_CREATED_SUCCESS,
  EVENT_DATE,
  EVENT_DESCRIPTION,
  EVENT_MODE,
  EVENT_TIME,
  EVENT_TITLE,
  EVENT_UPDATED_SUCCESS,
  EVENT_VENU_NAME,
  MSG_SELECT_ORGANIZATION,
  MSG_SOMETHING_WENT_WRONG,
  OFFLINE,
  ONLINE,
  ROUTER_ADMIN_EVENTS,
  SAVING,
  TITEL_ORGANIZATION
} from "../../../../constants/config-message";

export default function EventFormPage() {
  const router = useRouter();
  const params = useSearchParams();

  const eventId = params.get("id");
  const orgIdFromUrl = params.get("orgId");
  const isEdit = Boolean(eventId);

  const [organizations, setOrganizations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryIdentity: "",
    eventTypeIdentity: "",
    mode: OFFLINE,
    status: "PENDING",
    orgId: orgIdFromUrl || "",
    tags: [],
    bannerImages: [],
    eventLink: "",
    paymentLink: "",
    socialLinks: { linkedin: "", instagram: "" },
    eventLocation: { venue: "", mapLink: "", state: "", city: "", country: "", onlineMeetLink: "" },
    calendar: { startDate: "", endDate: "", startTime: "", endTime: "", timeZone: "UTC" },
    tickets: [{ name: "Standard", price: 0, sellStartDate: "", sellEndDate: "", quantity: 100 }],
    perks: [],
    accommodations: [],
    collaborators: [],
    certification: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  // LOAD MASTER DATA
  useEffect(() => {
    async function init() {
      const [orgs, cats, types] = await Promise.all([
        fetchOrganizationsApi(),
        fetchMasterListApi(MASTER_PATHS.EVENT_CATEGORY),
        fetchMasterListApi(MASTER_PATHS.EVENT_TYPE)
      ]);
      setOrganizations(orgs.data?.data || []);
      setCategories(cats.data?.data || []);
      setEventTypes(types.data?.data || []);
    }
    init();
  }, []);

  // LOAD EVENT (EDIT)
  useEffect(() => {
    async function loadEvent() {
      if (!isEdit) return;
      setFetching(true);
      try {
        const res = await adminGetEventByIdApi(orgIdFromUrl, eventId);
        const d = res.data?.data || res.data;
        if (!d) return;

        setForm({
          title: d.title || "",
          description: d.description || "",
          categoryIdentity: d.categoryIdentity || "",
          eventTypeIdentity: d.eventTypeIdentity || "",
          mode: d.mode || OFFLINE,
          status: d.status || "PENDING",
          orgId: d.orgIdentity || orgIdFromUrl,
          tags: d.tags || [],
          bannerImages: d.bannerImages || [],
          eventLink: d.eventLink || "",
          paymentLink: d.paymentLink || "",
          socialLinks: d.socialLinks || { linkedin: "", instagram: "" },
          eventLocation: d.eventLocation || { venue: "", mapLink: "", state: "", city: "", country: "", onlineMeetLink: "" },
          calendar: d.calendar || { startDate: "", endDate: "", startTime: "", endTime: "", timeZone: "UTC" },
          tickets: d.tickets?.length ? d.tickets : [{ name: "Standard", price: 0, sellStartDate: "", sellEndDate: "", quantity: 100 }],
          perks: d.perks || [],
          accommodations: d.accommodations || [],
          collaborators: d.collaborators || [],
          certification: d.certification || ""
        });
      } finally {
        setFetching(false);
      }
    }
    loadEvent();
  }, [isEdit, eventId, orgIdFromUrl]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateNested(parent, key, value) {
    setForm(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }));
  }

  // TICKETS DYNAMIC
  const addTicket = () => setForm(p => ({ ...p, tickets: [...p.tickets, { name: "", price: 0, sellStartDate: "", sellEndDate: "", quantity: 0 }] }));
  const removeTicket = (index) => setForm(p => ({ ...p, tickets: p.tickets.filter((_, i) => i !== index) }));
  const updateTicket = (index, key, value) => {
    const next = [...form.tickets];
    next[index][key] = value;
    setForm(p => ({ ...p, tickets: next }));
  };

  // SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErrorVisible(false);

    try {
      const res = isEdit
        ? await updateEventApi(form.orgId, eventId, form)
        : await createEventApi(form.orgId, form);

      if (res.status || res.data?.status) {
        setMsg(isEdit ? EVENT_UPDATED_SUCCESS : EVENT_CREATED_SUCCESS);
        setTimeout(() => router.push(`/admin/events/${form.orgId}/${eventId || ''}`), 1000);
      } else {
        setMsg(res.message || res.data?.message || MSG_SOMETHING_WENT_WRONG);
        setErrorVisible(true);
      }
    } catch (err) {
      setMsg(MSG_SOMETHING_WENT_WRONG);
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary shadow-sm" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
      <div className="max-w-1000 mx-auto">
        {/* HEADER */}
        <div className="d-flex align-items-center mb-4 gap-3">
          <button
            className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={() => router.back()}
            style={{ width: '40px', height: '40px' }}
          >
            <i className="bi bi-arrow-left fs-5"></i>
          </button>
          <div className="flex-grow-1">
            <h2 className="fw-black text-dark m-0">
              {isEdit ? 'Update Event Details' : 'Create New Event'}
            </h2>
            <p className="text-muted small mb-0">Experience management and event logistics configuration.</p>
          </div>
          <div className="d-none d-md-block">
            <span className={`badge rounded-pill px-3 py-2 ${form.status === 'APPROVED' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} border`}>
              {form.status}
            </span>
          </div>
        </div>

        {msg && (
          <div className={`alert ${errorVisible ? 'alert-danger' : 'alert-success'} border-0 shadow-sm rounded-4 mb-4 d-flex align-items-center gap-3 animate-fade-in`}>
            <i className={`bi ${errorVisible ? 'bi-exclamation-octagon' : 'bi-check-circle-fill'} fs-4`}></i>
            <div>{msg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="animate-fade-in">
          <div className="row g-4">
            {/* LEFT COLUMN: MAIN INFO */}
            <div className="col-lg-8">
              {/* BASIC INFO */}
              <div className="bg-white rounded-4 shadow-sm border p-4 mb-4">
                <h5 className="fw-bold mb-4 text-primary border-bottom pb-2">
                  <i className="bi bi-info-square me-2"></i> Core Information
                </h5>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">Event Title</label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3 bg-light border-light shadow-none"
                      value={form.title}
                      required
                      placeholder="e.g. Annual Tech Symposium 2026"
                      onChange={(e) => updateField("title", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Hosting Organization</label>
                    <select
                      className="form-select rounded-3 bg-light border-light shadow-none"
                      value={form.orgId}
                      required
                      onChange={(e) => updateField("orgId", e.target.value)}
                      disabled={isEdit}
                    >
                      <option value="">Select Organization</option>
                      {organizations.map(o => <option key={o.identity} value={o.identity}>{o.organizationName}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">Mode</label>
                    <select
                      className="form-select rounded-3 bg-light border-light shadow-none"
                      value={form.mode}
                      onChange={(e) => updateField("mode", e.target.value)}
                    >
                      <option value={OFFLINE}>Offline</option>
                      <option value={ONLINE}>Online</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">Status</label>
                    <select
                      className="form-select rounded-3 bg-light border-light shadow-none"
                      value={form.status}
                      onChange={(e) => updateField("status", e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Category</label>
                    <select
                      className="form-select rounded-3 bg-light border-light shadow-none"
                      value={form.categoryIdentity}
                      onChange={(e) => updateField("categoryIdentity", e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.identity} value={c.identity}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Event Type</label>
                    <select
                      className="form-select rounded-3 bg-light border-light shadow-none"
                      value={form.eventTypeIdentity}
                      onChange={(e) => updateField("eventTypeIdentity", e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {eventTypes.map(t => <option key={t.identity} value={t.identity}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">Description</label>
                    <textarea
                      className="form-control rounded-3 bg-light border-light shadow-none"
                      rows="5"
                      value={form.description}
                      placeholder="Write a clear and engaging description for the event..."
                      onChange={(e) => updateField("description", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* LOCATION & CALENDAR */}
              <div className="bg-white rounded-4 shadow-sm border p-4 mb-4">
                <h5 className="fw-bold mb-4 text-info border-bottom pb-2">
                  <i className="bi bi-geo-alt me-2"></i> Logistics & Schedule
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Start Date</label>
                    <input type="date" className="form-control rounded-3 bg-light border-light shadow-none" value={form.calendar.startDate?.split('T')[0]} onChange={e => updateNested('calendar', 'startDate', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">End Date</label>
                    <input type="date" className="form-control rounded-3 bg-light border-light shadow-none" value={form.calendar.endDate?.split('T')[0]} onChange={e => updateNested('calendar', 'endDate', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">Start Time</label>
                    <input type="time" className="form-control rounded-3 bg-light border-light shadow-none" value={form.calendar.startTime} onChange={e => updateNested('calendar', 'startTime', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">End Time</label>
                    <input type="time" className="form-control rounded-3 bg-light border-light shadow-none" value={form.calendar.endTime} onChange={e => updateNested('calendar', 'endTime', e.target.value)} />
                  </div>
                  
                  <hr className="my-3 opacity-25" />
                  
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">Venue Name (Offline)</label>
                    <input type="text" className="form-control rounded-3 bg-light border-light shadow-none" value={form.eventLocation.venue} placeholder="The Grand Ballroom, Hotel Marriott" onChange={e => updateNested('eventLocation', 'venue', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">City</label>
                    <input type="text" className="form-control rounded-3 bg-light border-light shadow-none" value={form.eventLocation.city} onChange={e => updateNested('eventLocation', 'city', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">State</label>
                    <input type="text" className="form-control rounded-3 bg-light border-light shadow-none" value={form.eventLocation.state} onChange={e => updateNested('eventLocation', 'state', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">Country</label>
                    <input type="text" className="form-control rounded-3 bg-light border-light shadow-none" value={form.eventLocation.country} onChange={e => updateNested('eventLocation', 'country', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">Online Meeting Link</label>
                    <input type="url" className="form-control rounded-3 bg-light border-light shadow-none" value={form.eventLocation.onlineMeetLink} placeholder="Zoom / Google Meet URL" onChange={e => updateNested('eventLocation', 'onlineMeetLink', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* TICKETS SECTION */}
              <div className="bg-white rounded-4 shadow-sm border p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2 text-warning">
                  <h5 className="fw-bold m-0"><i className="bi bi-ticket-perforated me-2"></i> Ticket Inventory</h5>
                  <button type="button" className="btn btn-sm btn-outline-warning rounded-pill px-3" onClick={addTicket}>
                    <i className="bi bi-plus-lg"></i> Add Tier
                  </button>
                </div>
                {form.tickets.map((t, i) => (
                  <div key={i} className="p-3 bg-light rounded-4 border mb-3 position-relative animate-fade-in">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-bold small text-muted text-uppercase">Ticket Name</label>
                        <input type="text" className="form-control form-control-sm border-0 bg-white" value={t.name} onChange={e => updateTicket(i, 'name', e.target.value)} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold small text-muted text-uppercase">Price</label>
                        <div className="input-group input-group-sm">
                          <span className="input-group-text border-0 bg-white">₹</span>
                          <input type="number" className="form-control border-0 bg-white" value={t.price} onChange={e => updateTicket(i, 'price', e.target.value)} />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold small text-muted text-uppercase">Quantity</label>
                        <input type="number" className="form-control form-control-sm border-0 bg-white" value={t.quantity} onChange={e => updateTicket(i, 'quantity', e.target.value)} />
                      </div>
                    </div>
                    {form.tickets.length > 1 && (
                      <button type="button" className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 p-2" onClick={() => removeTicket(i)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* PERKS & AMENITIES */}
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="bg-white rounded-4 shadow-sm border p-4 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold m-0 text-success"><i className="bi bi-gift me-2"></i> Perks</h6>
                      <button type="button" className="btn btn-sm btn-link p-0" onClick={() => setForm(p => ({ ...p, perks: [...p.perks, ""] }))}>Add</button>
                    </div>
                    {form.perks.map((perk, i) => (
                      <div key={i} className="input-group input-group-sm mb-2 shadow-none">
                        <input type="text" className="form-control bg-light border-0" value={perk} onChange={e => {
                          const next = [...form.perks];
                          next[i] = e.target.value;
                          updateField('perks', next);
                        }} />
                        <button type="button" className="btn btn-light border-0" onClick={() => updateField('perks', form.perks.filter((_, idx) => idx !== i))}><i className="bi bi-x"></i></button>
                      </div>
                    ))}
                    {form.perks.length === 0 && <p className="text-muted small text-center my-3 italic">No perks added.</p>}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="bg-white rounded-4 shadow-sm border p-4 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold m-0 text-indigo" style={{ color: '#6366f1' }}><i className="bi bi-house-door me-2"></i> Accommodations</h6>
                      <button type="button" className="btn btn-sm btn-link p-0" onClick={() => setForm(p => ({ ...p, accommodations: [...p.accommodations, ""] }))}>Add</button>
                    </div>
                    {form.accommodations.map((acc, i) => (
                      <div key={i} className="input-group input-group-sm mb-2 shadow-none">
                        <input type="text" className="form-control bg-light border-0" value={acc} onChange={e => {
                          const next = [...form.accommodations];
                          next[i] = e.target.value;
                          updateField('accommodations', next);
                        }} />
                        <button type="button" className="btn btn-light border-0" onClick={() => updateField('accommodations', form.accommodations.filter((_, idx) => idx !== i))}><i className="bi bi-x"></i></button>
                      </div>
                    ))}
                    {form.accommodations.length === 0 && <p className="text-muted small text-center my-3 italic">No accommodations listed.</p>}
                  </div>
                </div>
              </div>

              {/* COLLABORATORS */}
              <div className="bg-white rounded-4 shadow-sm border p-4 mt-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold m-0 text-primary"><i className="bi bi-people me-2"></i> Collaborators / Sponsors</h6>
                  <button type="button" className="btn btn-sm btn-link p-0" onClick={() => setForm(p => ({ ...p, collaborators: [...p.collaborators, ""] }))}>Add</button>
                </div>
                <div className="row g-2">
                  {form.collaborators.map((collab, i) => (
                    <div key={i} className="col-md-6">
                      <div className="input-group input-group-sm mb-2 shadow-none">
                        <span className="input-group-text bg-light border-0"><i className="bi bi-person"></i></span>
                        <input type="text" className="form-control bg-light border-0" value={collab} placeholder="Name" onChange={e => {
                          const next = [...form.collaborators];
                          next[i] = e.target.value;
                          updateField('collaborators', next);
                        }} />
                        <button type="button" className="btn btn-light border-0" onClick={() => updateField('collaborators', form.collaborators.filter((_, idx) => idx !== i))}><i className="bi bi-x"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
                {form.collaborators.length === 0 && <p className="text-muted small text-center my-3 italic">No collaborators added.</p>}
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <div className="col-lg-4">
              {/* MEDIA & LINKS */}
              <div className="bg-white rounded-4 shadow-sm border p-4 sticky-top" style={{ top: '2rem' }}>
                <h6 className="text-secondary fw-bold small text-uppercase mb-4">Media & Promotion</h6>
                
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Banner Images (URLs)</label>
                  <div className="bg-light p-3 rounded-4 border mb-2 text-center">
                    {form.bannerImages.length > 0 ? (
                      <img src={form.bannerImages[0]} className="w-100 rounded-3 shadow-sm mb-2" style={{ maxHeight: '150px', objectFit: 'cover' }} alt="Banner" />
                    ) : (
                      <div className="py-4 text-muted"><i className="bi bi-images display-6"></i></div>
                    )}
                  </div>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 bg-light border-light"
                    placeholder="Enter main banner URL"
                    value={form.bannerImages[0] || ""}
                    onChange={(e) => updateField("bannerImages", [e.target.value])}
                  />
                </div>

                <div className="mb-4">
                  <h6 className="text-secondary fw-bold small text-uppercase mb-3">External Links</h6>
                  <div className="mb-2">
                    <label className="small text-muted mb-1">Event Website</label>
                    <input type="url" className="form-control form-control-sm bg-light border-light" value={form.eventLink} onChange={e => updateField('eventLink', e.target.value)} />
                  </div>
                  <div>
                    <label className="small text-muted mb-1">Payment / Registration Link</label>
                    <input type="url" className="form-control form-control-sm bg-light border-light" value={form.paymentLink} onChange={e => updateField('paymentLink', e.target.value)} />
                  </div>
                </div>

                  <hr className="my-4" />

                <div className="mb-4">
                  <h6 className="text-secondary fw-bold small text-uppercase mb-3">Extras</h6>
                  <div className="mb-3">
                    <label className="small text-muted mb-1">Tags (Comma separated)</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm bg-light border-light" 
                      value={form.tags.join(', ')} 
                      onChange={e => updateField('tags', e.target.value.split(',').map(s => s.trim()))} 
                    />
                  </div>
                  <div>
                    <label className="small text-muted mb-1">Certification Info</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm bg-light border-light" 
                      value={form.certification} 
                      onChange={e => updateField('certification', e.target.value)} 
                    />
                  </div>
                </div>

                <hr className="my-4" />

                <div className="mb-4">
                  <h6 className="text-secondary fw-bold small text-uppercase mb-3">Social Connect</h6>
                  <div className="input-group input-group-sm mb-2">
                    <span className="input-group-text bg-light border-light"><i className="bi bi-linkedin text-primary"></i></span>
                    <input type="text" className="form-control bg-light border-light" placeholder="LinkedIn URL" value={form.socialLinks.linkedin} onChange={e => updateNested('socialLinks', 'linkedin', e.target.value)} />
                  </div>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light border-light"><i className="bi bi-instagram text-danger"></i></span>
                    <input type="text" className="form-control bg-light border-light" placeholder="Instagram URL" value={form.socialLinks.instagram} onChange={e => updateNested('socialLinks', 'instagram', e.target.value)} />
                  </div>
                </div>

                {/* SUBMIT ACTIONS */}
                <div className="d-grid gap-2 mt-5">
                  <button 
                    type="submit" 
                    className="btn btn-primary py-3 rounded-4 shadow-sm fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="d-flex align-items-center justify-content-center gap-2">
                        <span className="spinner-border spinner-border-sm"></span> Processing...
                      </span>
                    ) : (
                      isEdit ? 'Update Event' : 'Publish Event'
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-light py-2 rounded-4 border"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .max-w-1000 { max-width: 1000px; }
        .fw-black { font-weight: 900; }
        .cursor-pointer { cursor: pointer; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }
        input:focus, textarea:focus, select:focus {
          background-color: #fff !important;
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
        }
        .bg-success-subtle { background-color: #d1fae5; }
        .bg-warning-subtle { background-color: #fef3c7; }
      `}</style>
    </div>
  );
}

