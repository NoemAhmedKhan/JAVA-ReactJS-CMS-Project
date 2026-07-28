// ─────────────────────────────────────────────────────────────────────────────
// csvUtils.js
//
// Two responsibilities:
//   1. exportContactsToCSV  — turns a contacts array into a downloadable file
//   2. parseAndValidateCSV  — reads an uploaded file, checks required fields,
//                             and returns clean rows (or a list of errors)
//
// Keeping CSV logic here (not inside components) means components stay simple:
// they just call a function and handle the result.
// ─────────────────────────────────────────────────────────────────────────────

// The column order used for both export headers and import validation.
// Changing the order here automatically updates both directions.
export const CSV_HEADERS = ["firstName", "lastName", "email", "phone", "address"];

// Human-readable labels shown in the downloaded file's header row.
const CSV_HEADER_LABELS = {
  firstName: "First Name",
  lastName:  "Last Name",
  email:     "Email",
  phone:     "Phone",
  address:   "Address",
};

// Fields the backend requires to create a contact.
// If any of these are missing or empty in an imported row, that row is rejected.
const REQUIRED_FIELDS = ["firstName", "email", "phone"];


// ─── EXPORT ──────────────────────────────────────────────────────────────────

/**
 * Converts contacts array → CSV text → triggers a browser file download.
 *
 * Behaviour:
 *  - Always writes the header row.
 *  - Writes data rows only when contacts exist.
 *  - Wraps any value containing a comma or quote in double-quotes so the CSV
 *    stays valid regardless of what users stored in their contacts.
 *
 * @param {Array}  contacts  - The full contacts array (may be empty).
 * @param {string} filename  - e.g. "contacts_YYYY-MM-DD.csv"
 */
export const exportContactsToCSV = (contacts, filename) => {
  // Build the header row using human-readable labels
  const headerRow = CSV_HEADERS
      .map((key) => CSV_HEADER_LABELS[key])
      .join(",");

  // Build one CSV row per contact
  const dataRows = contacts.map((contact) =>
      CSV_HEADERS
          .map((key) => {
            const value = String(contact[key] ?? ""); // undefined → empty string

            // The ="value" trick forces any spreadsheet app to treat the cell as text.
            if (key === "phone" && value) {
              return `="${value}"`;
            }

            // All other values: wrap in quotes only if they contain a comma,
            // double-quote, or newline — otherwise write the value as-is.
            return value.includes(",") || value.includes('"') || value.includes("\n")
                ? `"${value.replace(/"/g, '""')}"` // escape any internal double-quotes
                : value;
          })
          .join(",")
  );

  // Join header + data rows with newlines
  const csvText = [headerRow, ...dataRows].join("\n");

  // Create a temporary invisible link, click it, then remove it
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // free memory
};


// ─── IMPORT ──────────────────────────────────────────────────────────────────

/**
 * Reads a CSV File object and returns a promise that resolves to:
 *
 *   { rows: Contact[], errors: string[] }
 *
 *  - rows   → valid contacts ready to be sent to the backend one-by-one
 *  - errors → human-readable messages for every row that failed validation
 *
 * The caller decides what to do with rows and errors (show a summary toast,
 * display a detailed list, etc.). This function only parses and validates.
 *
 * Accepted header names (case-insensitive, spaces ignored):
 *   "First Name" / "firstname"   → firstName
 *   "Last Name"  / "lastname"    → lastName
 *   "Email"                      → email
 *   "Phone"                      → phone
 *   "Address"                    → address
 *
 * @param {File} file - The File object from an <input type="file"> element.
 * @returns {Promise<{ rows: object[], errors: string[] }>}
 */
export const parseAndValidateCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read the file."));

    reader.onload = (event) => {
      const text = event.target.result;

      // Split into lines; filter out completely blank lines
      const lines = text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

      if (lines.length < 2) {
        // Only a header row (or nothing) — nothing to import
        return resolve({ rows: [], errors: ["The CSV file contains no data rows."] });
      }

      // ── Parse the header row ───────────────────────────────────────────────
      // Normalize: lowercase + remove spaces so "First Name" and "firstname"
      // both map to the same key.
      const rawHeaders = lines[0].split(",").map((h) => h.trim());

      // Map each CSV column name to our internal field key
      const HEADER_MAP = {
        "firstname":  "firstName",
        "first name": "firstName",
        "lastname":   "lastName",
        "last name":  "lastName",
        "email":      "email",
        "phone":      "phone",
        "address":    "address",
      };

      const columnKeys = rawHeaders.map(
          (h) => HEADER_MAP[h.toLowerCase().replace(/\s+/g, " ")] ?? null
      );

      // ── Parse data rows ────────────────────────────────────────────────────
      const rows   = [];
      const errors = [];

      lines.slice(1).forEach((line, idx) => {
        const rowNumber = idx + 2; // +2 because idx is 0-based and row 1 is headers
        const values    = line.split(",").map((v) => v.trim());

        // Build a contact object from this row using the column mapping
        const contact = {};
        columnKeys.forEach((key, colIdx) => {
          if (!key) return;
          let value = values[colIdx] ?? "";

          // Strip the ="..." wrapper written by exportContactsToCSV for phone numbers.
          // This means a file exported from this app can be re-imported without issues.
          if (key === "phone" && value.startsWith('="') && value.endsWith('"')) {
            value = value.slice(2, -1); // remove leading =" and trailing "
          }

          contact[key] = value;
        });

        // ── Validate required fields ───────────────────────────────────────
        const missingFields = REQUIRED_FIELDS.filter((f) => !contact[f]?.trim());

        if (missingFields.length > 0) {
          const labels = missingFields.map((f) => CSV_HEADER_LABELS[f]);
          errors.push(`Row ${rowNumber}: missing required field(s): ${labels.join(", ")}.`);
          return; // skip this row — do not add to rows
        }

        rows.push(contact);
      });

      resolve({ rows, errors });
    };

    // Trigger the read — result arrives in reader.onload above
    reader.readAsText(file);
  });
};
