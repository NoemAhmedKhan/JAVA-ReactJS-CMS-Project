
import { useState } from "react";
import Modal from "../common/Modal";
import "../common/Modal.css";
import "./ChangePasswordModal.css";

const ChangePasswordModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFields, setShowFields] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const token = localStorage.getItem("TOKEN");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.currentPassword) e.currentPassword = "Current password is required.";
    if (formData.newPassword.length < 8 || formData.newPassword.length > 16)
      e.newPassword = "Password must be 8–16 characters.";
    else {
      const rx = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/;
      if (!rx.test(formData.newPassword))
        e.newPassword = "Must include uppercase, digit, and special character.";
    }
    if (formData.newPassword !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReset = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/profile/changepassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      if (res.status === 200) {
        const data = await res.json();
        onSuccess();
        onClose();
        console.log(data.message);
      }
      else {
        setErrors({ currentPassword: "Incorrect Current Password!" });
      }
    } catch (err) {
      console.error("Change password error:", err);
    } finally {
      setLoading(false);
    }
  };

  const ToggleEye = ({ field }) => (
    <button
      type="button"
      className="eye-toggle"
      onClick={() => setShowFields((p) => ({ ...p, [field]: !p[field] }))}
      aria-label="Toggle visibility"
    >
      <i className={`fas fa-eye${showFields[field] ? "-slash" : ""}`} />
    </button>
  );

  return (
    <Modal title="Change Password" onClose={onClose} size="sm">
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="currentPassword">Current Password</label>
        <div className="pw-input-wrap">
          <input
            type={showFields.current ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            className={`modal-input ${errors.currentPassword ? "modal-input-error" : ""}`}
            placeholder="Enter current password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          <ToggleEye field="current" />
        </div>
        {errors.currentPassword && <span className="modal-field-error">{errors.currentPassword}</span>}
      </div>

      <div className="modal-form-group">
        <label className="modal-label" htmlFor="newPassword">New Password</label>
        <div className="pw-input-wrap">
          <input
            type={showFields.new ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            className={`modal-input ${errors.newPassword ? "modal-input-error" : ""}`}
            placeholder="Min. 8 characters"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <ToggleEye field="new" />
        </div>
        {errors.newPassword && <span className="modal-field-error">{errors.newPassword}</span>}
      </div>

      <div className="modal-form-group" style={{ marginBottom: 0 }}>
        <label className="modal-label" htmlFor="confirmPassword">Confirm New Password</label>
        <div className="pw-input-wrap">
          <input
            type={showFields.confirm ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            className={`modal-input ${errors.confirmPassword ? "modal-input-error" : ""}`}
            placeholder="Re-enter new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <ToggleEye field="confirm" />
        </div>
        {errors.confirmPassword && <span className="modal-field-error">{errors.confirmPassword}</span>}
      </div>

      <div className="modal-footer">
        <button className="btn-modal-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="btn-modal-primary" onClick={handleReset} disabled={loading}>
          {loading ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-key" />}
          {loading ? "Updating…" : "Reset Password"}
        </button>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
