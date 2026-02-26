"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminGetEventByIdApi, updateEventStatusApi } from "../../../../../lib/apiClient";
import {
  APPROVED,
  BTN_BACK,
  CONDITION_BG_DANGER,
  CONDITION_BG_SUCCESS,
  CONDITION_BG_WARNING,
  EVENT_MODE,
  EVENT_STATUS,
  LOADING,
  PENDING,
  REJECTED,
  TABLE_NO_DATA,
  TITEL_ORGANIZATION,
} from "../../../../../constants/config-message";

export default function SingleEventPage() {
  const { orgId, eventId } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    load();
  }, [orgId, eventId]);

  async function load() {
    setLoading(true);
    try {
      const res = await adminGetEventByIdApi(orgId, eventId);
      setData(res.data?.data || null);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (newStatus) => {
    if (!confirm(`Are you sure you want to mark this event as ${newStatus}?`)) return;
    setUpdatingStatus(true);
    try {
      await updateEventStatusApi(data.identity, newStatus);
      load();
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary shadow-sm" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  if (!data) return <div className="p-5 text-center">Event not found.</div>;

  const org = data.org || {};
  const location = data.location || {};

  return (
    <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
      {/* TOP HEADER / ACTION BAR */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={() => router.back()}
            style={{ width: '40px', height: '40px' }}
          >
            <i className="bi bi-arrow-left fs-5"></i>
          </button>
          <div>
            <h2 className="fw-black text-dark m-0">{data.title}</h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 small text-muted">
                <li className="breadcrumb-item">Events</li>
                <li className="breadcrumb-item active">{data.identity.substring(0, 8)}...</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary px-4 rounded-3 d-flex align-items-center gap-2 shadow-sm"
            onClick={() => router.push(`/admin/events/create?id=${data.identity}&orgId=${data.orgIdentity}`)}
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
          
          <div className="dropdown">
            <button 
              className={`btn px-4 rounded-3 text-white d-flex align-items-center gap-2 dropdown-toggle shadow-sm ${
                data.status === APPROVED ? 'bg-success' : 
                data.status === REJECTED ? 'bg-danger' : 'bg-warning'
              }`}
              type="button"
              data-bs-toggle="dropdown"
              disabled={updatingStatus}
            >
              <i className="bi bi-shield-check"></i> {data.status}
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2">
              <li><button className="dropdown-item rounded-2 mb-1" onClick={() => handleStatusChange(APPROVED)}><i className="bi bi-check-circle text-success me-2"></i> Approve</button></li>
              <li><button className="dropdown-item rounded-2 mb-1" onClick={() => handleStatusChange(PENDING)}><i className="bi bi-hourglass-split text-warning me-2"></i> Mark Pending</button></li>
              <li><button className="dropdown-item rounded-2" onClick={() => handleStatusChange(REJECTED)}><i className="bi bi-x-circle text-danger me-2"></i> Reject</button></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: PRIMARY CONTENT */}
        <div className="col-lg-8">
          
          {/* BANNER CAROUSEL / IMAGE */}
          <div className="bg-white rounded-4 shadow-sm border overflow-hidden mb-4 animate-fade-in">
            {data.bannerImages && data.bannerImages.length > 0 ? (
              <div id="eventBannerCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {data.bannerImages.map((img, idx) => (
                    <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={idx}>
                      <img src={img} className="d-block w-100" style={{ height: '400px', objectFit: 'cover' }} alt={`Banner ${idx + 1}`} />
                    </div>
                  ))}
                </div>
                {data.bannerImages.length > 1 && (
                  <>
                    <button className="carousel-control-prev" type="button" data-bs-target="#eventBannerCarousel" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#eventBannerCarousel" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="p-5 text-center bg-light text-muted" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                  <i className="bi bi-image fs-1 d-block mb-2 opacity-50"></i>
                  No Banner Image Provided
                </div>
              </div>
            )}
          </div>

          {/* TABS NAVIGATION */}
          <div className="overflow-auto mb-4 bg-white p-2 rounded-4 shadow-sm border">
            <ul className="nav nav-pills custom-pills flex-nowrap" style={{ minWidth: 'max-content' }}>
              {['overview', 'location_schedule', 'tickets', 'team_contacts', 'extras'].map((tab) => (
                <li className="nav-item flex-fill text-center" key={tab}>
                  <button 
                    className={`nav-link w-100 rounded-3 py-2 fw-bold text-uppercase border-0 ${activeTab === tab ? 'active shadow-sm' : 'text-secondary'}`}
                    onClick={() => setActiveTab(tab)}
                    style={{ fontSize: '0.7rem', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                  >
                    {tab.replace('_', ' & ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* TAB CONTENT */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-primary">About the Event</h5>
                <p className="text-dark-secondary lh-lg mb-5" style={{ whiteSpace: 'pre-line' }}>
                  {data.description || "No description provided."}
                </p>
                
                <h5 className="fw-bold mb-3 border-bottom pb-2">Classification</h5>
                <div className="row g-4 mb-4">
                  <InfoBlock label="Root Category" value={data.categoryName} icon="bi-grid" color="text-primary" />
                  <InfoBlock label="Event Type" value={data.eventTypeName} icon="bi-tag" color="text-info" />
                  <InfoBlock label="Status" value={data.status} icon="bi-info-circle" color="text-warning" />
                  <InfoBlock label="Identity" value={data.identity} icon="bi-fingerprint" color="text-secondary" />
                </div>

                <h5 className="fw-bold mb-3 border-bottom pb-2">Tags</h5>
                <div className="d-flex flex-wrap gap-2">
                  {data.tags && data.tags.map((tag, i) => (
                    <span key={i} className="badge bg-light text-primary border border-primary px-3 py-2 rounded-pill fw-medium">
                      {tag}
                    </span>
                  ))}
                  {(!data.tags || data.tags.length === 0) && <span className="text-muted small italic">No tags associated.</span>}
                </div>
              </div>
            )}

            {activeTab === 'location_schedule' && (
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-primary"><i className="bi bi-geo-alt me-2"></i> Venue & Location</h5>
                <div className="row g-4 mb-5">
                  <InfoBlock label="Venue Name" value={location.venue} icon="bi-building" col="12" />
                  <InfoBlock label="City" value={location.city} icon="bi-geo" />
                  <InfoBlock label="State" value={location.state} icon="bi-map" />
                  <InfoBlock label="Country" value={location.country} icon="bi-globe" />
                  <div className="col-md-12">
                    <div className="p-3 border rounded-4 bg-light">
                      <div className="text-muted small fw-bold text-uppercase mb-2">Google Maps Link</div>
                      {location.mapLink ? (
                        <a href={location.mapLink} target="_blank" rel="noreferrer" className="text-decoration-none text-primary fw-bold d-flex align-items-center gap-2">
                          <i className="bi bi-box-arrow-up-right"></i> Open in Maps
                        </a>
                      ) : <span className="text-muted italic">Not Available</span>}
                    </div>
                  </div>
                  {data.mode === 'ONLINE' && (
                    <InfoBlock label="Online Meet Link" value={location.onlineMeetLink} icon="bi-camera-video" col="12" color="text-danger" />
                  )}
                </div>

                <h5 className="fw-bold mb-4 border-bottom pb-2 text-primary"><i className="bi bi-calendar3 me-2"></i> Event Schedule</h5>
                {data.calendars && data.calendars.map((cal, i) => (
                  <div key={i} className="card border-0 bg-light rounded-4 p-4 mb-3 d-flex flex-row align-items-center transition-all hover-lift">
                    <div className="bg-primary text-white p-3 rounded-4 me-4 text-center" style={{ minWidth: '90px' }}>
                      <div className="small fw-bold">{new Date(cal.startDate).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</div>
                      <div className="fs-2 fw-black">{new Date(cal.startDate).getDate()}</div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold m-0">{cal.startDate} <span className="mx-2 text-muted">to</span> {cal.endDate}</h6>
                      <p className="text-muted m-0 small fw-bold mt-1"><i className="bi bi-clock me-2"></i>{cal.startTime} - {cal.endTime} • {cal.timeZone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-success"><i className="bi bi-ticket-perforated me-2"></i> Ticket Inventory</h5>
                <div className="row g-3">
                  {data.tickets && data.tickets.map((t, i) => (
                    <div className="col-12" key={i}>
                      <div className="p-4 border rounded-4 bg-light-success border-start border-4 border-success">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h5 className="fw-black text-dark mb-1">{t.ticketName}</h5>
                            <span className="badge bg-white text-success border border-success fw-bold px-3 py-1 rounded-pill small">Available: {t.quantity}</span>
                          </div>
                          <div className="text-success display-6 fw-black">
                            {t.price === 0 ? 'FREE' : `₹${t.price}`}
                          </div>
                        </div>
                        <div className="row g-3 small text-muted fw-bold border-top pt-3">
                          <div className="col-md-6"><i className="bi bi-calendar-minus me-2"></i>Selling From: {t.sellingFrom}</div>
                          <div className="col-md-6"><i className="bi bi-calendar-plus me-2"></i>Selling To: {t.sellingTo}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!data.tickets || data.tickets.length === 0) && (
                    <div className="col-12 text-center p-5 bg-light rounded-4 italic text-muted">
                      <i className="bi bi-ticket fs-1 d-block mb-2 opacity-25"></i>
                      No tickets listed for this event.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'team_contacts' && (
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-indigo"><i className="bi bi-people me-2"></i> Collaborators</h5>
                <div className="row g-3 mb-5">
                  {data.Collaborator && data.Collaborator.map((c, i) => (
                    <div className="col-md-6" key={i}>
                      <div className="p-3 border rounded-4 hover-lift shadow-sm">
                        <div className="fw-bold text-dark">{c.member?.organizationName}</div>
                        <div className="text-muted small fw-bold mt-1 text-uppercase">{c.member?.orgDept} | {c.member?.location}</div>
                      </div>
                    </div>
                  ))}
                  {(!data.Collaborator || data.Collaborator.length === 0) && <div className="col-12 text-muted italic p-3 bg-light rounded-4">No official collaborators listed.</div>}
                </div>

                <h5 className="fw-bold mb-4 border-bottom pb-2 text-indigo"><i className="bi bi-person-lines-fill me-2"></i> Event Contacts</h5>
                <div className="row g-3">
                  {data.eventContacts && data.eventContacts.map((c, i) => (
                    <div className="col-md-6" key={i}>
                      <div className="p-3 border rounded-4 bg-light shadow-sm">
                        <div className="fw-black text-dark mb-2">{c.name}</div>
                        <div className="small mb-1 fw-bold"><i className="bi bi-telephone me-2 text-indigo"></i>{c.phone}</div>
                        <div className="small fw-bold"><i className="bi bi-envelope me-2 text-indigo"></i>{c.email}</div>
                      </div>
                    </div>
                  ))}
                  {(!data.eventContacts || data.eventContacts.length === 0) && <div className="col-12 text-muted p-3 bg-light rounded-4 italic">No contact information provided.</div>}
                </div>
              </div>
            )}

            {activeTab === 'extras' && (
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <div className="row mb-5 g-4">
                  <div className="col-md-6">
                    <h5 className="fw-bold mb-4 border-bottom pb-2 text-violet"><i className="bi bi-gift me-2"></i> Event Perks</h5>
                    <div className="d-flex flex-column gap-2">
                       {data.eventPerks && data.eventPerks.map((p, i) => (
                         <div key={i} className="p-3 bg-light rounded-4 border-start border-4 border-violet shadow-sm">
                           <div className="fw-bold text-dark">{p.perk?.perkName}</div>
                         </div>
                       ))}
                       {(!data.eventPerks || data.eventPerks.length === 0) && <div className="text-muted p-3 bg-light rounded-4 italic">No perks listed.</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5 className="fw-bold mb-4 border-bottom pb-2 text-rose"><i className="bi bi-door-open me-2"></i> Accommodations</h5>
                    <div className="d-flex flex-column gap-2">
                       {data.eventAccommodations && data.eventAccommodations.map((a, i) => (
                         <div key={i} className="p-3 bg-light rounded-4 border-start border-4 border-rose shadow-sm">
                           <div className="fw-bold text-dark">{a.accommodation?.accommodationName}</div>
                         </div>
                       ))}
                       {(!data.eventAccommodations || data.eventAccommodations.length === 0) && <div className="text-muted p-3 bg-light rounded-4 italic">No accommodations listed.</div>}
                    </div>
                  </div>
                </div>

                {data.cert && (
                  <div className="p-4 border border-info rounded-4 bg-info-light position-relative overflow-hidden mb-4 shadow-sm">
                    <div className="position-absolute top-0 end-0 p-3 opacity-10">
                      <i className="bi bi-patch-check display-1"></i>
                    </div>
                    <h5 className="fw-bold text-info mb-3"><i className="bi bi-patch-check-fill me-2"></i> Digital Certification</h5>
                    <p className="m-0 fw-black fs-4 text-dark">{data.cert.certName}</p>
                    <p className="small text-muted mb-0 fw-bold mt-1 text-uppercase ls-1">Identity: {data.cert.identity}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="col-lg-4">
          
          {/* STATS CARD */}
          <div className="bg-white rounded-4 shadow-sm border p-4 mb-4 animate-fade-in">
            <h6 className="text-secondary fw-bold small text-uppercase mb-4" style={{ letterSpacing: '0.05em' }}>Analytics & Impact</h6>
            <div className="row g-3">
              <div className="col-4 text-center">
                <div className="text-primary fs-3 mb-1"><i className="bi bi-eye"></i></div>
                <div className="fw-black fs-4 text-dark">{data.viewCount || 0}</div>
                <div className="text-muted small fw-bold">Views</div>
              </div>
              <div className="col-4 text-center border-start border-end">
                <div className="text-rose fs-3 mb-1"><i className="bi bi-heart"></i></div>
                <div className="fw-black fs-4 text-dark">{data.likeCount || 0}</div>
                <div className="text-muted small fw-bold">Likes</div>
              </div>
              <div className="col-4 text-center">
                <div className="text-success fs-3 mb-1"><i className="bi bi-share"></i></div>
                <div className="fw-black fs-4 text-dark">{data.shareCount || 0}</div>
                <div className="text-muted small fw-bold">Shares</div>
              </div>
            </div>
          </div>

          {/* ORGANIZER PROFILE CARD */}
          <div className="bg-white rounded-4 shadow-sm border p-4 mb-4 overflow-hidden position-relative animate-fade-in">
            <div className="position-absolute top-0 end-0 p-3">
              {org.isVerified && <i className="bi bi-patch-check-fill text-primary fs-4" title="Verified Organizer"></i>}
            </div>
            
            <h6 className="text-secondary fw-bold small text-uppercase mb-4" style={{ letterSpacing: '0.05em' }}>Organizer</h6>
            
            <div className="d-flex align-items-center mb-4">
              <img 
                src={org.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(org.organizationName || 'U')}&background=4f46e5&color=fff&size=64`} 
                className="rounded-circle shadow-sm me-3 border border-3 border-white" 
                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                alt="Organizer"
              />
              <div>
                <h6 className="fw-black m-0 fs-5 text-dark">{org.organizationName}</h6>
                <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.6rem' }}>{org.organizationCategory}</div>
              </div>
            </div>

            <div className="d-flex flex-column gap-2 mb-4">
              <div className="p-3 bg-light rounded-3 small">
                <div className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Direct Email</div>
                <div className="fw-bold text-dark">{org.domainEmail}</div>
              </div>
              {org.website && (
                <div className="p-3 bg-light rounded-3 small">
                   <div className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>Official Website</div>
                   <a href={org.website} target="_blank" rel="noreferrer" className="fw-bold text-primary text-decoration-none d-block text-truncate">
                     {org.website}
                   </a>
                </div>
              )}
            </div>

            <button 
              className="btn btn-primary w-100 rounded-3 py-2 fw-bold shadow-sm"
              onClick={() => router.push(`/admin/organizations/${org.identity}`)}
            >
              View Full Profile
            </button>
          </div>

          {/* FINANCIALS & ACCESS */}
          <div className="bg-white rounded-4 shadow-sm border p-4 mb-4 animate-fade-in">
             <h6 className="text-secondary fw-bold small text-uppercase mb-4" style={{ letterSpacing: '0.05em' }}>Access & Registration</h6>
             <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-light mb-4 border-start border-4 border-primary shadow-sm hover-lift">
               <div className="fw-black text-dark"><i className="bi bi-credit-card me-2"></i> Entry Fee</div>
               <div className={data.isPaid ? 'text-primary' : 'text-success'}>
                 <span className="fw-black fs-5">{data.isPaid ? 'PAID' : 'FREE'}</span>
               </div>
             </div>
             
             {data.eventLink && (
               <a href={data.eventLink} target="_blank" rel="noreferrer" className="btn btn-outline-dark w-100 rounded-3 py-2 mb-2 fw-bold d-flex align-items-center justify-content-center gap-2">
                 <i className="bi bi-link-45deg"></i> External Event Link
               </a>
             )}
             
             {data.paymentLink && (
               <a href={data.paymentLink} target="_blank" rel="noreferrer" className="btn btn-outline-primary w-100 rounded-3 py-2 mb-4 fw-bold d-flex align-items-center justify-content-center gap-2">
                 <i className="bi bi-wallet2"></i> Payment Gateway
               </a>
             )}

             <div className="p-3 rounded-4 bg-light border-start border-4 border-info">
               <div className="small fw-bold text-muted mb-2 text-uppercase" style={{ fontSize: '0.65rem' }}>Eligible Departments</div>
               <div className="d-flex flex-wrap gap-2">
                 {data.eligibleDeptIdentities && data.eligibleDeptIdentities.map((dept, i) => (
                   <span key={i} className="badge bg-white text-info border border-info rounded-pill px-2 py-1 small">{dept}</span>
                 ))}
                 {(!data.eligibleDeptIdentities || data.eligibleDeptIdentities.length === 0) && <span className="small text-muted italic fw-bold">Open to all departments</span>}
               </div>
             </div>
          </div>

          {/* SOCIAL LINKS */}
          {data.socialLinks && (data.socialLinks.instagram || data.socialLinks.linkedin || data.socialLinks.whatsapp) && (
            <div className="bg-white rounded-4 shadow-sm border p-4 animate-fade-in">
              <h6 className="text-secondary fw-bold small text-uppercase mb-4" style={{ letterSpacing: '0.05em' }}>Event Promotion</h6>
              <div className="d-flex gap-4 justify-content-center">
                {data.socialLinks.instagram && <a href={data.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-rose fs-1 transition-all"><i className="bi bi-instagram"></i></a>}
                {data.socialLinks.linkedin && <a href={data.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-primary fs-1 transition-all"><i className="bi bi-linkedin"></i></a>}
                {data.socialLinks.whatsapp && <a href={data.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="text-success fs-1 transition-all"><i className="bi bi-whatsapp"></i></a>}
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .text-rose { color: #e11d48; }
        .text-indigo { color: #4f46e5; }
        .text-violet { color: #8b5cf6; }
        .bg-info-light { background-color: #f0f9ff; }
        .bg-light-success { background-color: #f0fdf4; }
        .border-violet { border-color: #8b5cf6 !important; }
        .border-rose { border-color: #e11d48 !important; }
        .ls-1 { letter-spacing: 0.1em; }
        
        .custom-pills .nav-link {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #64748b;
          border-radius: 12px !important;
        }
        .custom-pills .nav-link.active {
          background-color: #4f46e5;
          color: white !important;
          transform: translateY(-2px);
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.06) !important;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}

function InfoBlock({ label, value, icon, color = "text-muted", col = "6" }) {
  return (
    <div className={`col-md-${col}`}>
      <div className="p-3 border rounded-4 bg-light h-100 transition-all hover-lift">
        <div className="d-flex align-items-center gap-2 mb-2">
          <i className={`bi ${icon} ${color}`}></i>
          <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.65rem' }}>{label}</span>
        </div>
        <div className="fw-bold text-dark text-break fs-6">{value || "Not Provided"}</div>
      </div>
    </div>
  );
}
