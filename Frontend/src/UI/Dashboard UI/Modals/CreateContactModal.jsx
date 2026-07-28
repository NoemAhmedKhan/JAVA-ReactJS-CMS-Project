import Modal from "../common/Modal";
import ContactFormFields from "./ContactFormFields";
import useContactForm from "../hooks/useContactForm";
import "../common/Modal.css";
import {useNavigate} from "react-router-dom";

const CreateContactModal = ({ onClose, onSuccess }) => {
  const { formData, errors, loading, setLoading, handleChange, validate } = useContactForm();
  const token = localStorage.getItem("TOKEN");
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
      try {
          const res = await fetch("http://localhost:8080/contacts/create", {
              method: "POST",
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
