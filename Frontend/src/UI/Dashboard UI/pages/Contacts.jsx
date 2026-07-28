import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import ContactTable from "../Dashboard/ContactTable";
import SearchBar from "../Dashboard/SearchBar";
import Pagination from "../common/Pagination";
import CreateContactModal from "../Modals/CreateContactModal";
import UpdateContactModal from "../Modals/UpdateContactModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import Toast from "../common/Toast";
import "./Dashboard.css";

const CONTACTS_PER_PAGE = 10;

// Favourites first, then A→Z by firstName within each group.
const sortContacts = (list) =>
  [...list].sort((a, b) => {
    if (a.favourite === b.favourite) {
      return (a.firstName || "").localeCompare(b.firstName || "");
    }
    return a.favourite ? -1 : 1;
  });


const Contacts = () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [allContacts, setAllContacts] = useState([]); // full server list
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading]         = useState(false);

  const [showCreate, setShowCreate]           = useState(false);
  const [showUpdate, setShowUpdate]           = useState(false);
  const [showDelete, setShowDelete]           = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast]             = useState(null);

  const navigate = useNavigate();
  const token    = localStorage.getItem("TOKEN");

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch all contacts ────────────────────────────────────────────────────
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/contacts", {
        headers: { Authorization: `Bearer ${token}` },
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
        setAllContacts(sortContacts(data.contacts || []));
      }
    } catch (err) {
      console.error("Fetch contacts error:", err);
      showToast("Failed to load contacts.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch once on mount via async IIFE (avoids ESLint setState-in-effect warning)
  useEffect(() => {
    (async () => { await fetchContacts(); })();
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  // Filtering and pagination happen here in the browser — no API calls.
  // Runs only when allContacts, searchQuery, or currentPage actually changes.
  const { paginatedContacts, totalFiltered } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = q
      ? allContacts.filter((c) => {
          const full = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
          return full.includes(q);
        })
      : allContacts;

    // allContacts is already sorted; filtering preserves that order.
    const start             = (currentPage - 1) * CONTACTS_PER_PAGE;
    const paginatedContacts = filtered.slice(start, start + CONTACTS_PER_PAGE);

    return { paginatedContacts, totalFiltered: filtered.length };
  }, [allContacts, searchQuery, currentPage]);

  const totalPages = Math.ceil(totalFiltered / CONTACTS_PER_PAGE);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // reset so user never lands on an empty page
  };

  const handleEdit   = (contact) => { setSelectedContact(contact); setShowUpdate(true); };
  const handleDelete = (contact) => { setSelectedContact(contact); setShowDelete(true); };

  // ── Favourite toggle ─────────────────────────────────
  const handleToggleFavourite = async (contact) => {
    // Toggle the same field the backend sends — no new key created
    const updated = { ...contact, favourite: !contact.favourite };

    // Update UI immediately before the API responds
    setAllContacts((prev) =>
        sortContacts(prev.map((c) => (c.id === contact.id ? updated : c)))
    );

    try {
      const res = await fetch(`http://localhost:8080/contacts/${contact.id}/favourite`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ favourite: updated.favourite }),
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
      }

    } catch (err) {
      console.error("Toggle favourite error:", err);
      await fetchContacts();
      showToast("Failed to update favourite.", "error");
    }
  };


  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-root">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="dashboard-main">

        {/* ── Top bar ── */}
        <header className="dash-topbar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            <span /><span /><span />
          </button>

          <div className="dash-topbar-title">
            <h1>My Contacts</h1>
          </div>

          <div className="dash-topbar-actions">
            <button className="btn-primary btn-sm" onClick={() => setShowCreate(true)}>
              <i className="fas fa-plus" />
              <span>New Contact</span>
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="dash-body">

          <SearchBar onSearch={handleSearch} />

          <div className="dash-table-card">
            <ContactTable
              contacts={paginatedContacts}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavourite={handleToggleFavourite}
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

      {/* ── Modals ── */}
      {showCreate && (
        <CreateContactModal
          onClose={() => setShowCreate(false)}
          onSuccess={async () => { await fetchContacts(); showToast("Contact created!"); }}
        />
      )}
      {showUpdate && selectedContact && (
        <UpdateContactModal
          contact={selectedContact}
          onClose={() => { setShowUpdate(false); setSelectedContact(null); }}
          onSuccess={async () => { await fetchContacts(); showToast("Contact updated!"); }}
        />
      )}
      {showDelete && selectedContact && (
        <DeleteConfirmModal
          contact={selectedContact}
          onClose={() => { setShowDelete(false); setSelectedContact(null); }}
          onSuccess={async () => { await fetchContacts(); showToast("Contact deleted.", "info"); }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Contacts;
