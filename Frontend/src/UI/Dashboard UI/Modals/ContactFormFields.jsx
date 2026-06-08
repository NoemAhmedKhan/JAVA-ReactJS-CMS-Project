const ContactFormFields = ({ formData, errors, handleChange }) => {
  return (
    <>
      <div className="modal-form-row">
        <div className="modal-form-group">
          <label className="modal-label" htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`modal-input ${errors.firstName ? "modal-input-error" : ""}`}
            placeholder="Ahmed"
            value={formData.firstName}
            onChange={handleChange}
            autoComplete="given-name"
          />
          {errors.firstName && <span className="modal-field-error">{errors.firstName}</span>}
        </div>

        <div className="modal-form-group">
          <label className="modal-label" htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`modal-input ${errors.lastName ? "modal-input-error" : ""}`}
            placeholder="Khan"
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name"
          />
          {errors.lastName && <span className="modal-field-error">{errors.lastName}</span>}
        </div>
      </div>

      <div className="modal-form-group">
        <label className="modal-label" htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          className={`modal-input ${errors.email ? "modal-input-error" : ""}`}
          placeholder="ahmed@example.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        {errors.email && <span className="modal-field-error">{errors.email}</span>}
      </div>

      <div className="modal-form-group">
        <label className="modal-label" htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className={`modal-input ${errors.phone ? "modal-input-error" : ""}`}
          placeholder="+92 300 1234567"
          value={formData.phone}
          onChange={handleChange}
          autoComplete="tel"
        />
        {errors.phone && <span className="modal-field-error">{errors.phone}</span>}
      </div>

      <div className="modal-form-group" style={{ marginBottom: 0 }}>
        <label className="modal-label" htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          className="modal-input"
          placeholder="123 Main St, Karachi"
          value={formData.address}
          onChange={handleChange}
          autoComplete="street-address"
        />
      </div>
    </>
  );
};

export default ContactFormFields;
