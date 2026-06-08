import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="searchbar-wrap">
      <div className="searchbar-inner">
        <i className="fas fa-search searchbar-icon" />
        <input
          type="text"
          className="searchbar-input"
          placeholder="Search contacts by name..."
          value={value}
          onChange={handleChange}
        />
        {value && (
          <button className="searchbar-clear" onClick={handleClear} aria-label="Clear search">
            <i className="fas fa-times" />
          </button>
        )}
      </div>
      <span className="searchbar-hint">
        <i className="fas fa-info-circle" /> Search by first or last name
      </span>
    </div>
  );
};

export default SearchBar;
