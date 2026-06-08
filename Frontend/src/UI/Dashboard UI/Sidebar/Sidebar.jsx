import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const NAV_ITEMS = [
  { icon: "fas fa-th-large", label: "Dashboard", path: "/dashboard", key: "dashboard" },
  { icon: "fas fa-address-book", label: "Contacts", path: "/dashboard", key: "contacts" },
  { icon: "fas fa-user-circle", label: "Profile", path: "/profile", key: "profile" },
];

const Sidebar = ({ isOpen, onClose, activePage }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="fas fa-address-card" />
          </div>
          <div className="brand-text">
            <span className="brand-name">ContactHub</span>
            <span className="brand-sub">Management System</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            <i className="fas fa-times" />
          </button>
        </div>

        {/* User mini card */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user.fullName || "User"}</span>
            <span className="sidebar-user-email">{user.email || ""}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <span className="sidebar-section-label">MAIN MENU</span>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`sidebar-nav-item ${activePage === item.key ? "active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              <i className={item.icon} />
              <span>{item.label}</span>
              {activePage === item.key && <div className="nav-active-bar" />}
            </button>
          ))}
        </nav>

        {/* Bottom logout */}
        <div className="sidebar-footer">
          <button
            className="sidebar-logout-btn"
            onClick={() => {
              localStorage.removeItem("jwt_token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            <i className="fas fa-sign-out-alt" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
