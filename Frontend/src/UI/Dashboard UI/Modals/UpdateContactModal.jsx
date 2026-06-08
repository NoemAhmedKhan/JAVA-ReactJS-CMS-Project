import { useEffect } from "react";
import Modal from "../common/Modal";
import ContactFormFields from "./ContactFormFields";
import useContactForm from "../hooks/useContactForm";
import "../common/Modal.css";

const UpdateContactModal = ({ contact, onClose, onSuccess }) => {
  const { formData, setFormData, errors, loading, setLoading, handleChange, validate } =
    useContactForm();
  const token = localStorage.getItem("jwt_token");

  // Pre-populate form with existing contact data
  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        address: contact.address || "",
      });
    }
  }, [contact, setFormData]);

  const handleUpdate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Update contact error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Update Contact" onClose={onClose} size="md">
      <ContactFormFields
        formData={formData}
        errors={errors}
        handleChange={handleChange}
      />
      <div className="modal-footer">
        <button className="btn-modal-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="btn-modal-primary" onClick={handleUpdate} disabled={loading}>
          {loading ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-save" />}
          {loading ? "Updating…" : "Save Changes"}
        </button>
      </div>
    </Modal>
  );
};

export default UpdateContactModal;
