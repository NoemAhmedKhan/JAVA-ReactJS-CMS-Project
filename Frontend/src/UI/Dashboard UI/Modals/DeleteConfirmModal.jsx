import { useState } from "react";
import Modal from "../common/Modal";
import "../common/Modal.css";
import "./DeleteConfirmModal.css";

const DeleteConfirmModal = ({ contact, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("jwt_token");

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Delete contact error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Delete Contact" onClose={onClose} size="sm">
      <div className="delete-confirm-body">
        <div className="delete-icon-wrap">
          <i className="fas fa-exclamation-triangle" />
        </div>
        <p className="delete-confirm-msg">
          Are you sure you want to delete{" "}
          <strong>
            {contact.firstName} {contact.lastName}
          </strong>
          ?
        </p>
        <p className="delete-confirm-sub">
          This action cannot be undone and will permanently remove this contact.
        </p>
      </div>
      <div className="modal-footer">
        <button className="btn-modal-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="btn-modal-danger" onClick={handleDelete} disabled={loading}>
          {loading ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-trash" />}
          {loading ? "Deleting…" : "Delete Contact"}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
