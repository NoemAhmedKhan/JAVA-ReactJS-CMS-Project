import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import ChangePasswordModal from "../Modals/ChangePasswordModal";
import Toast from "../common/Toast";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const token = localStorage.getItem("jwt_token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState({
    fullName: storedUser.fullName || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
  });
  const [formData, setFormData] = useState({ ...profile });
  const [errors, setErrors] = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFormData(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: formData.fullName, phone: formData.phone }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setFormData(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        setEditing(false);
        showToast("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Update profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const avatarLetter = (profile.fullName || "U").charAt(0).toUpperCase();

  return (
    <div className={`dashboard-root ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage="profile"
      />

      <div className="dashboard-main">
        <header className="dash-topbar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span /><span /><span />
          </button>
          <div className="dash-topbar-title">
            <h1>Contact Manager</h1>
            <span className="dash-breadcrumb">My Profile</span>
          </div>
        </header>

        <div className="profile-body">
          {/* Profile Card */}
          <div className="profile-card">
            {/* Header banner */}
            <div className="profile-banner" />

            <div className="profile-card-content">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">{avatarLetter}</div>
              </div>

              <div className="profile-info-header">
                <div>
                  <h2 className="profile-display-name">{profile.fullName || "User"}</h2>
                  <p className="profile-display-email">{profile.email}</p>
                </div>
                <div className="profile-header-actions">
                  {!editing && (
                    <button
                      className="btn-outline"
                      onClick={() => setEditing(true)}
                    >
                      <i className="fas fa-pen" />
                      Edit Profile
                    </button>
                  )}
                  <button
                    className="btn-outline"
                    onClick={() => setShowChangePw(true)}
                  >
                    <i className="fas fa-key" />
                    Change Password
                  </button>
                  <button className="btn-logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" />
                    Logout
                  </button>
                </div>
              </div>

              <div className="profile-divider" />

              {/* Form */}
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label className="profile-field-label">Full Name</label>
                  {editing ? (
                    <>
                      <input
                        type="text"
                        name="fullName"
                        className={`modal-input ${errors.fullName ? "modal-input-error" : ""}`}
                        value={formData.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                      />
                      {errors.fullName && <span className="modal-field-error">{errors.fullName}</span>}
                    </>
                  ) : (
                    <span className="profile-field-value">{profile.fullName || "—"}</span>
                  )}
                </div>

                <div className="profile-field">
                  <label className="profile-field-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="modal-input"
                    value={profile.email}
                    disabled
                    readOnly
                  />
                  <span className="profile-field-hint">
                    <i className="fas fa-lock" /> Email cannot be changed
                  </span>
                </div>

                <div className="profile-field">
                  <label className="profile-field-label">Phone Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      className="modal-input"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      autoComplete="tel"
                    />
                  ) : (
                    <span className="profile-field-value">{profile.phone || "—"}</span>
                  )}
                </div>
              </div>

              {editing && (
                <div className="profile-edit-actions">
                  <button
                    className="btn-modal-secondary"
                    onClick={() => { setEditing(false); setFormData({ ...profile }); setErrors({}); }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button className="btn-modal-primary" onClick={handleSave} disabled={loading}>
                    {loading ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-save" />}
                    {loading ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showChangePw && (
        <ChangePasswordModal
          onClose={() => setShowChangePw(false)}
          onSuccess={() => showToast("Password changed successfully!")}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Profile;
