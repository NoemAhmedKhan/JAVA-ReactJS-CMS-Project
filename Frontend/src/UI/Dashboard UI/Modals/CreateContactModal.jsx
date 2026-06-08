import Modal from "../common/Modal";
import ContactFormFields from "./ContactFormFields";
import useContactForm from "../hooks/useContactForm.js";
import "../common/Modal.css";

// API: POST /api/contacts
// Body: { firstName, lastName, email, phone, address }
// Response: 201 Created with contact object

const CreateContactModal = ({ onClose, onSuccess }) => {
  const { formData, errors, loading, setLoading, handleChange, validate } = useContactForm();
  const token = localStorage.getItem("jwt_token");

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
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
      console.error("Create contact error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add New Contact" onClose={onClose} size="md">
      <ContactFormFields
        formData={formData}
        errors={errors}
        handleChange={handleChange}
      />
      <div className="modal-footer">
        <button className="btn-modal-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="btn-modal-primary" onClick={handleSave} disabled={loading}>
          {loading ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-plus" />}
          {loading ? "Saving…" : "Save Contact"}
        </button>
      </div>
    </Modal>
  );
};

export default CreateContactModal;
