import "./Features.css";

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="section-inner">
        <div className="section-header">
          <div className="section-tag">Why ContactHub</div>
          <h2 className="section-title">Instant Access To Every Contact.</h2>
          <p className="section-sub">
            From organizing contacts to maintain integrity — all in one secure platform.
          </p>
        </div>

        <div className="features-grid">

          <div className="feature-card" style={{ "--delay": "0s" }}>
            <div className="feature-icon">
              <i className="fas fa-address-card"></i>
            </div>
            <h3>Smart Contacts</h3>
            <p>Store profiles digitally with details such as name, email, and phone no.</p>
          </div>

          <div className="feature-card" style={{ "--delay": ".1s" }}>
            <div className="feature-icon">
              <i className="fas fa-layer-group"></i>
            </div>
            <h3>Group Management</h3>
            <p>Organize contacts into groups for targeted communication.</p>
          </div>

          <div className="feature-card" style={{ "--delay": ".2s" }}>
            <div className="feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Instant Search</h3>
            <p>Find any contact in milliseconds with search and filters.</p>
          </div>

          <div className="feature-card" style={{ "--delay": ".3s" }}>
            <div className="feature-icon">
              <i className="fas fa-lock"></i>
            </div>
            <h3>Authentication</h3>
            <p>Your contacts are secured with proper authentication.</p>
          </div>

          <div className="feature-card" style={{ "--delay": ".4s" }}>
            <div className="feature-icon">
              <i className="fas fa-sync-alt"></i>
            </div>
            <h3>Sync Contacts</h3>
            <p>Sync contacts across all devices in real time.</p>
          </div>

          <div className="feature-card" style={{ "--delay": ".5s" }}>
            <div className="feature-icon">
              <i className="fa-solid fa-arrow-pointer"></i>
            </div>
            <h3>CRUD Operations</h3>
            <p>Maintain contacts efficiently using CRUD operations.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;