import "./ContactTable.css";

const ContactTable = ({ contacts, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="table-state">
        <div className="table-spinner">
          <i className="fas fa-circle-notch fa-spin" />
        </div>
        <span>Loading contacts…</span>
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="table-state">
        <div className="table-empty-icon">
          <i className="fas fa-address-book" />
        </div>
        <p className="table-empty-title">No contacts found</p>
        <p className="table-empty-sub">Add your first contact using the button above.</p>
      </div>
    );
  }

  return (
    <div className="contact-table-wrap">
      <table className="contact-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th className="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c, idx) => (
            <tr key={c.id} className="contact-row">
              <td className="td-index">
                <span className="row-num">{idx + 1}</span>
              </td>
              <td className="td-name">
                <div className="contact-avatar">
                  {(c.firstName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="contact-name-wrap">
                  <span className="contact-fullname">
                    {c.firstName} {c.lastName}
                  </span>
                </div>
              </td>
              <td className="td-email">
                <a href={`mailto:${c.email}`} className="contact-email">
                  {c.email || "—"}
                </a>
              </td>
              <td className="td-phone">{c.phone || "—"}</td>
              <td className="td-address">{c.address || "—"}</td>
              <td className="td-actions">
                <button
                  className="action-btn action-btn--edit"
                  onClick={() => onEdit(c)}
                  title="Edit contact"
                >
                  <i className="fas fa-pen" />
                </button>
                <button
                  className="action-btn action-btn--delete"
                  onClick={() => onDelete(c)}
                  title="Delete contact"
                >
                  <i className="fas fa-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;
