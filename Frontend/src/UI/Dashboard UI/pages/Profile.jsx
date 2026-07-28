import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChangePasswordModal from "../Modals/ChangePasswordModal";
import EditProfileModal from "../Modals/EditProfileModal";
import Toast from "../common/Toast";
import "./Profile.css";
import {useNavigate} from "react-router-dom";

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("TOKEN");

  // Seed from localStorage so UI renders immediately, then overwrite with API response
  const storedUser = JSON.parse(localStorage.getItem("USER") || "{}");
  const [profile, setProfile] = useState({
    fullName: storedUser.fullName || "",
    email: storedUser.email || "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/profile", {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if(res.status === 401) {
          localStorage.removeItem("USER");
          localStorage.removeItem("TOKEN");
          navigate("/login");
        }
        if(res.ok) {
          const data = await res.json();
          console.log(data.message);
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleProfileUpdated = (updatedUser) => {
    const { fullName, email } = updatedUser;
    setProfile({ fullName, email });
    showToast("Profile updated successfully!");
  };

  return (
    <div className="dashboard-root">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="dashboard-main">
        <header className="dash-topbar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            <span />
            <span />
            <span />
          </button>
          <div className="dash-topbar-title">
            <h1>My Profile</h1>
          </div>
        </header>

        <div className="profile-body">
          <div className="profile-card">
            <div className="profile-banner">
              <div className="profile-banner-content">
                <h2 className="profile-banner-name">{profile.fullName || "User"}</h2>
                <p className="profile-banner-email">{profile.email || ""}</p>
              </div>
            </div>

            <div className="profile-card-content">
              <div className="profile-actions">
                <button className="btn-outline" onClick={() => setShowEditProfile(true)}>
                  <i className="fas fa-pen" />
                  Edit Profile
                </button>
                <button className="btn-outline" onClick={() => setShowChangePw(true)}>
                  <i className="fas fa-key" />
                  Change Password
                </button>
              </div>

              <div className="profile-divider" />

              <div className="profile-form-grid">
                <div className="profile-field">
                  <label className="profile-field-label">Full Name</label>
                  <span className="profile-field-value">{profile.fullName || "—"}</span>
                </div>

                <div className="profile-field">
                  <label className="profile-field-label">Email Address</label>
                  <span className="profile-field-value">{profile.email || "—"}</span>
                  <span className="profile-field-hint">
                    <i className="fas fa-info-circle" /> Update via Edit Profile
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditProfile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onSuccess={handleProfileUpdated}
        />
      )}

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
