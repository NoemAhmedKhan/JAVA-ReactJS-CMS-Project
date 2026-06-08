import { useState, useEffect, useCallback } from "react";
import Sidebar from "../Sidebar/Sidebar";
import StatsCard from "../Dashboard/StatsCard";
import ContactTable from "../Dashboard/ContactTable";
import SearchBar from "../Dashboard/SearchBar";
import Pagination from "../common/Pagination";
import CreateContactModal from "../Modals/CreateContactModal";
import UpdateContactModal from "../Modals/UpdateContactModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import Toast from "../common/Toast";
import "./Dashboard.css";

const CONTACTS_PER_PAGE = 10;

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("TOKEN");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage - 1,
        size: CONTACTS_PER_PAGE,
        ...(searchQuery && { search: searchQuery }),
      });
      const res = await fetch(`/api/contacts?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setContacts(data.content || []);
      setFilteredContacts(data.content || []);
      setTotalContacts(data.totalElements || 0);
    } catch (err) {
      console.error("Fetch contacts error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, token]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setShowUpdate(true);
  };

  const handleDelete = (contact) => {
    setSelectedContact(contact);
    setShowDelete(true);
  };

  // API: POST /api/contacts/export → returns CSV blob
  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/contacts/export", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contacts.csv";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Contacts exported successfully!");
    } catch (err) {
      showToast("Export failed. Try again.", "error");
    }
  };

  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/contacts/import", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        showToast("Contacts imported successfully!");
        fetchContacts();
      } else {
        showToast("Import failed. Check CSV format.", "error");
      }
    } catch (err) {
      showToast("Import failed. Try again.", "error");
    }
    e.target.value = "";
  };

  const totalPages = Math.ceil(totalContacts / CONTACTS_PER_PAGE);

  return (
    <div className={`dashboard-root ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage="dashboard"
      />

      <div className="dashboard-main">
        {/* Top bar */}
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
            <span className="dash-breadcrumb">Dashboard</span>
          </div>
          <div className="dash-topbar-actions">
            <label className="btn-outline btn-sm" title="Import CSV">
              <i className="fas fa-file-import" />
              <span>Import</span>
              <input
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleImportCSV}
              />
            </label>
            <button className="btn-outline btn-sm" onClick={handleExportCSV} title="Export CSV">
              <i className="fas fa-file-export" />
              <span>Export</span>
            </button>
            <button className="btn-primary btn-sm" onClick={() => setShowCreate(true)}>
              <i className="fas fa-plus" />
              <span>New Contact</span>
            </button>
          </div>
        </header>

        <div className="dash-body">
          {/* Stats */}
          <div className="stats-row">
            <StatsCard
              icon="fas fa-address-book"
              label="Total Contacts"
              value={totalContacts}
              color="primary"
            />
            <StatsCard
              icon="fas fa-user-check"
              label="This Month"
              value="—"
              color="success"
            />
            <StatsCard
              icon="fas fa-star"
              label="Favourites"
              value="—"
              color="accent"
            />
          </div>

          {/* Search */}
          <SearchBar onSearch={handleSearch} />

          {/* Table */}
          <div className="dash-table-card">
            <ContactTable
              contacts={filteredContacts}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateContactModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => { fetchContacts(); showToast("Contact created!"); }}
        />
      )}
      {showUpdate && selectedContact && (
        <UpdateContactModal
          contact={selectedContact}
          onClose={() => { setShowUpdate(false); setSelectedContact(null); }}
          onSuccess={() => { fetchContacts(); showToast("Contact updated!"); }}
        />
      )}
      {showDelete && selectedContact && (
        <DeleteConfirmModal
          contact={selectedContact}
          onClose={() => { setShowDelete(false); setSelectedContact(null); }}
          onSuccess={() => { fetchContacts(); showToast("Contact deleted.", "info"); }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Dashboard;
