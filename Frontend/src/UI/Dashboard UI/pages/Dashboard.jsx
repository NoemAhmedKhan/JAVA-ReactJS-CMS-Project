import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import StatsCard from "../Dashboard/StatsCard";
import ContactTable from "../Dashboard/ContactTable";
import SearchBar from "../Dashboard/SearchBar";
import Pagination from "../common/Pagination";
import CreateContactModal from "../Modals/CreateContactModal";
import Toast from "../common/Toast";
import { exportContactsToCSV, parseAndValidateCSV } from "../CSVUtils/csvUtils";
import "./Dashboard.css";

const CONTACTS_PER_PAGE = 10;

// Reusable sort — favourites first, then A→Z by firstName.
const sortContacts = (list) =>
    [...list].sort((a, b) => {
      if (a.favourite === b.favourite) {
        return (a.firstName || "").localeCompare(b.firstName || "");
      }
      return a.favourite ? -1 : 1;
    });


const Dashboard = () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [allContacts, setAllContacts]     = useState([]);  // full server list
  const [currentPage, setCurrentPage]     = useState(1);
  const [searchQuery, setSearchQuery]     = useState("");
  const [loading, setLoading]             = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast]             = useState(null);

  // ref for the hidden file input so we can reset it after import
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const token    = localStorage.getItem("TOKEN");

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch all contacts (runs on mount + after every mutation) ─────────────
  // Defined as a plain async function (not useCallback) to avoid the
  // setState-in-effect ESLint warning. Called from the IIFE inside useEffect
  // and directly from modal onSuccess handlers.
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/dashboard", {
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

  // Fetch once on mount. IIFE keeps the effect body synchronous so ESLint
  useEffect(() => {
    (async () => { await fetchContacts(); })();
  }, []);

  // ── Derived data (no extra API calls) ────────────────────────────────────
  // useMemo recomputes only when allContacts, searchQuery, or currentPage
  // changes — searching and paginating are instant, pure JS operations.
  const { paginatedContacts, totalFiltered, favouriteCount } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = q
        ? allContacts.filter((c) => {
          const full = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
          return full.includes(q);
        })
        : allContacts;

    // allContacts is already sorted; filtering preserves that order.
    const start              = (currentPage - 1) * CONTACTS_PER_PAGE;
    const paginatedContacts  = filtered.slice(start, start + CONTACTS_PER_PAGE);
    const favouriteCount     = allContacts.filter((c) => c.favourite).length;

    return { paginatedContacts, totalFiltered: filtered.length, favouriteCount };
  }, [allContacts, searchQuery, currentPage]);

  const totalPages = Math.ceil(totalFiltered / CONTACTS_PER_PAGE);

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // reset to page 1 so the user never sees an empty page
  };



  // ── CSV Export ────────────────────────────────────────────────────────────
  // exportContactsToCSV handles everything: building rows, quoting values,
  // creating a Blob, and triggering the download. No backend call needed.
  const handleExportCSV = () => {
    const filename = `contacts_${new Date().toISOString().slice(0, 10)}.csv`;
    exportContactsToCSV(allContacts, filename);

    const msg = allContacts.length > 0
        ? `Exported ${allContacts.length} contact(s).`
        : "Exported CSV with headers only (no contacts yet).";
    showToast(msg);
  };

  // ── CSV Import ────────────────────────────────────────────────────────────
  // Flow:
  //   1. User picks a .csv file  →  onChange fires
  //   2. parseAndValidateCSV reads the file and checks required fields
  //   3. Valid rows are POSTed to the backend one-by-one
  //   4. A summary toast shows how many imported / how many failed validation
  //   5. fetchContacts() refreshes the list with the newly added contacts
  const handleImportCSV = async (e) => {
    const file = e.target.files[0];

    // Reset the input immediately so the same file can be selected again later
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      showToast("Please select a .csv file.", "error");
      return;
    }

    setImportLoading(true);

    try {
      // Step 1 — Parse + validate entirely in the browser (no network call)
      const { rows: validRows, errors: validationErrors } = await parseAndValidateCSV(file);

      if (validRows.length === 0) {
        // Nothing passed validation — show the first error as feedback
        showToast(validationErrors[0] || "No valid rows found in the file.", "error");
        return;
      }

      // Step 2 — POST each valid row to the backend
      let importedCount = 0;
      let failedCount   = validationErrors.length; // already-invalid rows counted here

      for (const contact of validRows) {
        try {
          const res = await fetch("http://localhost:8080/dashboard/importcontacts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(contact),
          });

          if (res.ok) {
            const data = await res.json();
            console.log("ID: " + data.id + " || Name: " + data.name + " || " + data.message);
            importedCount++;
          } else {
            failedCount++;
          }
        } catch {
          failedCount++;
        }
      }

      console.log("Imported Contacts: " + importedCount);
      console.log("Failed Contacts: " + failedCount);

      // Step 3 — Refresh the list so newly imported contacts appear
      await fetchContacts();

      // Step 4 — Show a clear summary toast
      const parts = [];
      if (importedCount > 0)  parts.push(`${importedCount} imported`);
      if (failedCount > 0)    parts.push(`${failedCount} failed`);
      const type = importedCount > 0 ? "success" : "error";
      showToast(parts.join(", ") + ".", type);

    } catch (err) {
      console.error("Import error:", err);
      showToast("Failed to read the file. Please try again.", "error");
    } finally {
      setImportLoading(false);
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
              <h1>My Dashboard</h1>
            </div>

            <div className="dash-topbar-actions">
              {/* Import — label wraps a hidden file input */}
              <label
                  className={`btn-outline btn-sm ${importLoading ? "btn-disabled" : ""}`}
                  title="Import CSV"
              >
                {importLoading
                    ? <><i className="fas fa-circle-notch fa-spin" /><span>Importing…</span></>
                    : <><i className="fas fa-file-import" /><span>Import</span></>
                }
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={handleImportCSV}
                    disabled={importLoading}
                />
              </label>

              {/* Export — pure client-side, no loading state needed */}
              <button className="btn-outline btn-sm" onClick={handleExportCSV} title="Export CSV">
                <i className="fas fa-file-export" />
                <span>Export</span>
              </button>
            </div>
          </header>

          {/* ── Body ── */}
          <div className="dash-body">

            {/* Stats */}
            <div className="stats-row">
              <StatsCard
                  icon="fas fa-address-book"
                  label="Total Contacts"
                  value={allContacts.length}
                  color="primary"
              />
              <StatsCard
                  icon="fas fa-star"
                  label="Favourites"
                  value={favouriteCount}
                  color="accent"
              />
            </div>

            {/* Search */}
            <SearchBar onSearch={handleSearch} />

            {/* Table + Pagination */}
            <div className="dash-table-card">
              <ContactTable
                  contacts={paginatedContacts}
                  loading={loading}
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

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
  );
};

export default Dashboard;
