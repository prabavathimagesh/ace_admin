'use client';
import { useEffect, useState } from 'react';

export default function EventTypeFormModal({
  show,
  initialData,
  onClose,
  onSubmit
}) {
  const [name, setName] = useState('');
  const [categoryIdentity, setCategoryIdentity] = useState('');
  const [color, setColor] = useState('#000000');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategoryIdentity(initialData.categoryIdentity || '');
      setColor(initialData.color || '#000000');
      setImage(null);
    } else {
      reset();
    }
  }, [initialData]);

  const reset = () => {
    setName('');
    setCategoryIdentity('');
    setColor('#000000');
    setImage(null);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('categoryIdentity', categoryIdentity);
    formData.append('color', color);

    if (image) {
      formData.append('image', image);
    }

    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ background: '#00000080' }}>
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5>{initialData ? 'Edit' : 'Add'} Event Type</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <input
              className="form-control mb-2"
              placeholder="Event Type Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="Category Identity"
              value={categoryIdentity}
              onChange={(e) => setCategoryIdentity(e.target.value)}
            />

            <input
              type="color"
              className="form-control mb-2"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />

            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}