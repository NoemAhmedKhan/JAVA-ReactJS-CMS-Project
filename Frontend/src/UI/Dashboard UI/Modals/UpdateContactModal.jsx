import { useEffect } from "react";
import Modal from "../common/Modal";
import ContactFormFields from "./ContactFormFields";
import useContactForm from "../hooks/useContactForm";
import "../common/Modal.css";
import {useNavigate} from "react-router-dom";

const UpdateContactModal = ({ contact, onClose, onSuccess }) => {
  const { formData, setFormData, errors, loading, setLoading, handleChange, validate } =
    useContactForm();
  const token = localStorage.getItem("TOKEN");
  const navigate = useNavigate();

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
      const res = await fetch(`http://localhost:8080/contacts/update/${contact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        localStorage.removeItem("USER");
        localStorage.removeItem("TOKEN");
        navigate("/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        console.log(data.message);
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
