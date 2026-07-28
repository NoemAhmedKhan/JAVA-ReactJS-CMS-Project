import { useState } from "react";
import Modal from "../common/Modal";
import "../common/Modal.css";
import {useNavigate} from "react-router-dom";

const EditProfileModal = ({ profile, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    email: profile.email || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("TOKEN");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required.";
    if (!formData.email.trim()) {
      e.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = "Invalid email address.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/profile/update", {
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

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("TOKEN");
        localStorage.removeItem("USER");

        localStorage.setItem("TOKEN", data.token);
        localStorage.setItem("USER", JSON.stringify(data.map));

        console.log(data.message);
        onSuccess(data.map);
        onClose();
      }
    } catch (err) {
      console.error("Edit profile error:", err);
      setErrors({ email: "Update failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Edit Profile" onClose={onClose} size="sm">
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="fullName">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          className={`modal-input ${errors.fullName ? "modal-input-error" : ""}`}
          placeholder="Your full name"
          value={formData.fullName}
          onChange={handleChange}
          autoComplete="name"
          autoFocus
        />
        {errors.fullName && <span className="modal-field-error">{errors.fullName}</span>}
      </div>

      <div className="modal-form-group" style={{ marginBottom: 0 }}>
        <label className="modal-label" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`modal-input ${errors.email ? "modal-input-error" : ""}`}
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        {errors.email && <span className="modal-field-error">{errors.email}</span>}
      </div>

      <div className="modal-footer">
        <button className="btn-modal-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="btn-modal-primary" onClick={handleSave} disabled={loading}>
          {loading ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-save" />}
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
