import "./ContactTable.css";

// Columns are opt-in via props:
//   onToggleFavourite  → shows the ★ favourites column
//   onEdit             → shows the edit button  } both needed for the
//   onDelete           → shows the delete button} Actions column to appear
//
// Dashboard passes none of these  → read-only table (ID, Name, Email, Phone, Address)
// Contacts  passes all three      → full table with Favourites + Actions columns

const ContactTable = ({ contacts, loading, onEdit, onDelete, onToggleFavourite }) => {
    // Whether to render each optional column
    const showFavourites = Boolean(onToggleFavourite);
    const showActions    = Boolean(onEdit && onDelete);

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

    if (!contacts?.length) {
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
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    {showFavourites && (
                        <th title="Favourites">
                            <i className="fas fa-star" />
                        </th>
                    )}
                    {showActions && <th>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {contacts.map((contact, idx) => (
                    <tr
                        key={contact.id}
                        className={`contact-row ${contact.favourite ? "contact-row--fav" : ""}`}
                    >
                        <td className="td-index">
                            <span className="row-num">{idx + 1}</span>
                        </td>

                        <td className="td-name">
                            <div className="contact-avatar">
                                {(contact.firstName || "?").charAt(0).toUpperCase()}
                            </div>
                            <span className="contact-fullname">
                  {contact.firstName} {contact.lastName}
                </span>
                        </td>

                        <td className="td-email">
                            {contact.email
                                ? <a href={`mailto:${contact.email}`} className="contact-email">{contact.email}</a>
                                : "—"
                            }
                        </td>

                        <td className="td-phone">{contact.phone || "—"}</td>
                        <td className="td-address">{contact.address || "—"}</td>

                        {showFavourites && (
                            <td className="td-fav">
                                <button
                                    className={`action-btn action-btn--fav ${contact.favourite ? "action-btn--fav-active" : ""}`}
                                    onClick={() => onToggleFavourite(contact)}
                                    title={contact.favourite ? "Remove from favourites" : "Add to favourites"}
                                    aria-label={contact.favourite ? "Unfavourite" : "Favourite"}
                                >
                                    <i className={contact.favourite ? "fas fa-star" : "far fa-star"} />
                                </button>
                            </td>
                        )}

                        {showActions && (
                            <td className="td-actions">
                                <button
                                    className="action-btn action-btn--edit"
                                    onClick={() => onEdit(contact)}
                                    title="Edit contact"
                                >
                                    <i className="fas fa-pen" />
                                </button>
                                <button
                                    className="action-btn action-btn--delete"
                                    onClick={() => onDelete(contact)}
                                    title="Delete contact"
                                >
                                    <i className="fas fa-trash" />
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactTable;
