export default function CrudLayout({ title, onAdd, children }) {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        {onAdd && (
          <button className="btn btn-primary btn-sm" onClick={onAdd}>
            + Add
          </button>
        )}
      </div>

      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
