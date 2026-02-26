"use client";

import { BTN_CANCEL } from "../../../constants/config-message";

export default function FullDetailModal({ show, item, type, onClose }) {
  if (!show || !item) return null;

  const renderValue = (val) => {
    if (val === null || val === undefined || val === "") return <span className="text-muted italic">Not Available</span>;
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (Array.isArray(val)) {
      if (val.length === 0) return <span className="text-muted italic">Empty</span>;
      return val.join(", ");
    }
    return val;
  };

  const renderSection = (title, content) => (
    <div className="mb-4">
      <h6 className="fw-bold text-primary border-bottom pb-2 mb-3">{title}</h6>
      <div className="row g-3">
        {content}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, col = "6" }) => (
    <div className={`col-md-${col}`}>
      <div className="p-2 border rounded-3 bg-light bg-opacity-50">
        <div className="text-muted small fw-medium text-uppercase" style={{ fontSize: '0.7rem' }}>{label}</div>
        <div className="fw-semibold text-dark text-break">{renderValue(value)}</div>
      </div>
    </div>
  );

  const renderOrganization = () => (
    <>
      <div className="text-center mb-4">
        {item.profileImage && <img src={item.profileImage} alt="Profile" className="rounded-circle shadow-sm mb-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
        <h3>{item.organizationName}</h3>
        <div className="d-flex justify-content-center gap-2">
          <span className={`badge-pill ${item.isActive ? 'bg-success' : 'bg-secondary'} text-white`}>{item.isActive ? 'Active' : 'Inactive'}</span>
          <span className={`badge-pill ${item.isVerified ? 'badge-verified' : 'badge-not-verified'}`}>{item.isVerified ? 'Verified' : 'Unverified'}</span>
        </div>
      </div>

      {renderSection("General Information", (
        <>
          <InfoItem label="Identity" value={item.identity} />
          <InfoItem label="Slug" value={item.slug} />
          <InfoItem label="Domain Email" value={item.domainEmail} />
          <InfoItem label="Category" value={item.organizationCategory} />
          <InfoItem label="Created At" value={new Date(item.createdAt).toLocaleString()} />
          <InfoItem label="Updated At" value={new Date(item.updatedAt).toLocaleString()} />
          <InfoItem label="Website" value={item.website} />
          <InfoItem label="Rank" value={item.rank} />
          <InfoItem label="Event Count" value={item.eventCount} />
          <InfoItem label="Admin Created" value={item.isAdminCreated} />
        </>
      ))}

      {renderSection("Location", (
        <>
          <InfoItem label="Country ID" value={item.country} />
          <InfoItem label="State ID" value={item.state} />
          <InfoItem label="City ID" value={item.city} />
        </>
      ))}

      {item.socialLinks && item.socialLinks.length > 0 && renderSection("Social Links", (
        item.socialLinks.map((sl, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="p-2 border rounded-3 bg-white">
              <div className="text-muted small text-capitalize">{sl.platform}</div>
              <a href={sl.url.startsWith('http') ? sl.url : `https://${sl.url}`} target="_blank" rel="noreferrer" className="text-primary text-decoration-none small text-break">{sl.url}</a>
            </div>
          </div>
        ))
      ))}
    </>
  );

  const renderEvent = () => (
    <>
      {item.bannerImages && item.bannerImages.length > 0 && (
        <div className="mb-4">
          <img src={item.bannerImages[0]} alt="Banner" className="w-100 rounded-4 shadow-sm" style={{ maxHeight: '250px', objectFit: 'cover' }} />
        </div>
      )}
      <div className="text-center mb-4">
        <h3>{item.title}</h3>
        <div className="d-flex justify-content-center gap-2">
          <span className={`badge-pill bg-primary text-white`}>{item.status}</span>
          <span className={`badge-pill bg-info text-white`}>{item.mode}</span>
          {item.isPaid ? <span className="badge-pill bg-warning text-dark">PAID</span> : <span className="badge-pill bg-light text-dark">FREE</span>}
        </div>
      </div>

      {renderSection("Basic Info", (
        <>
          <InfoItem label="Identity" value={item.identity} />
          <InfoItem label="Slug" value={item.slug} />
          <InfoItem label="Description" value={item.description} col="12" />
          <InfoItem label="Category Name" value={item.categoryName} />
          <InfoItem label="Event Type" value={item.eventTypeName} />
          <InfoItem label="View Count" value={item.viewCount} />
          <InfoItem label="Likes" value={item.likeCount} />
          <InfoItem label="Shares" value={item.shareCount} />
          <InfoItem label="Tags" value={item.tags?.join(", ")} col="12" />
        </>
      ))}

      {item.location && renderSection("Location & Venue", (
        <>
          <InfoItem label="Venue" value={item.location.venue} col="12" />
          <InfoItem label="Map Link" value={item.location.mapLink} col="12" />
          <InfoItem label="Meet Link" value={item.location.onlineMeetLink} col="12" />
        </>
      ))}

      {item.calendars && item.calendars.length > 0 && renderSection("Schedule", (
        item.calendars.map((c, idx) => (
          <div className="col-12" key={idx}>
            <div className="p-2 border rounded-3 bg-white mb-2">
              <div className="row">
                <div className="col-md-6"><span className="text-muted small me-2">Date:</span> {c.startDate} to {c.endDate}</div>
                <div className="col-md-6"><span className="text-muted small me-2">Time:</span> {c.startTime} - {c.endTime} ({c.timeZone})</div>
              </div>
            </div>
          </div>
        ))
      ))}

      {item.org && renderSection("Organizer Details", (
        <>
          <InfoItem label="Name" value={item.org.organizationName} />
          <InfoItem label="Category" value={item.org.organizationCategory} />
          <InfoItem label="Email" value={item.org.domainEmail} />
        </>
      ))}

      <div className="row">
        <div className="col-md-6">
          {item.eventPerks && item.eventPerks.length > 0 && renderSection("Perks", (
            item.eventPerks.map((p, idx) => <div className="col-12" key={idx}><div className="badge bg-light text-dark p-2 w-100 text-start">🎁 {p.perk?.perkName}</div></div>)
          ))}
        </div>
        <div className="col-md-6">
          {item.eventAccommodations && item.eventAccommodations.length > 0 && renderSection("Accommodations", (
            item.eventAccommodations.map((a, idx) => <div className="col-12" key={idx}><div className="badge bg-light text-dark p-2 w-100 text-start">🏠 {a.accommodation?.accommodationName}</div></div>)
          ))}
        </div>
      </div>

      {item.Collaborator && item.Collaborator.length > 0 && renderSection("Collaborators", (
        item.Collaborator.map((c, idx) => (
          <div className="col-md-6" key={idx}>
            <div className="p-2 border rounded-3 bg-white">
              <div className="fw-bold">{c.member?.organizationName}</div>
              <div className="text-muted small">{c.member?.orgDept} | {c.member?.location}</div>
            </div>
          </div>
        ))
      ))}

      {item.eventContacts && item.eventContacts.length > 0 && renderSection("Contacts", (
        item.eventContacts.map((c, idx) => (
          <div className="col-md-6" key={idx}>
            <div className="p-2 border rounded-3 bg-white">
              <div className="fw-bold">{c.name}</div>
              <div className="text-muted small">📞 {c.phone}</div>
              <div className="text-muted small">📧 {c.email}</div>
            </div>
          </div>
        ))
      ))}
    </>
  );

  const renderUser = () => (
    <>
      <div className="text-center mb-4">
        <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3 shadow-sm" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
          {item.name?.charAt(0)}
        </div>
        <h3>{item.name}</h3>
        <div className="d-flex justify-content-center gap-2">
          <span className={`badge-pill ${item.isActive ? 'bg-success' : 'bg-secondary'} text-white`}>{item.isActive ? 'Active' : 'Inactive'}</span>
          <span className={`badge-pill ${item.isDeleted ? 'bg-danger' : 'bg-success text-white'}`}>{item.isDeleted ? 'Deleted' : 'Safe'}</span>
        </div>
      </div>

      {renderSection("User Profile", (
        <>
          <InfoItem label="ID" value={item.id} />
          <InfoItem label="Identity" value={item.identity} />
          <InfoItem label="Email" value={item.email} />
          <InfoItem label="Phone" value={item.phone} />
          <InfoItem label="Created At" value={new Date(item.createdAt).toLocaleString()} />
        </>
      ))}
    </>
  );

  return (
    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-0 bg-white p-4 pb-0">
            <h5 className="modal-title fw-bold text-dark">{type === 'org' ? 'Organization' : type === 'event' ? 'Event' : 'User'} Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 pt-4 custom-scrollbar">
            {type === 'org' && renderOrganization()}
            {type === 'event' && renderEvent()}
            {type === 'user' && renderUser()}
          </div>
          <div className="modal-footer border-0 p-4 pt-0">
            <button className="btn btn-light px-4 py-2 rounded-3 fw-bold" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </div>
  );
}
