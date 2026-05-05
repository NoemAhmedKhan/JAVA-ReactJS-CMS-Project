import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="logo">
            <div className="logo-icon small">
              <i className="fas fa-address-book"></i>
            </div>
            <span className="logo-text">
              Contact<span className="logo-accent">Hub</span>
            </span>
          </div>
          <p>Manage your contacts efficiently and securely.</p>
        </div>

        <div className="footer-items">
          <div className="footer-col">
            <h4>Features</h4>
            <a href="#smart-contacts">Smart Contacts</a>
            <a href="#group-management">Group Management</a>
            <a href="#instant-search">Instant Search</a>
            <a href="#authentication">Authentication</a>
            <a href="#sync-contacts">Sync Contacts</a>
            <a href="#crud-operations">CRUD Operations</a>
          </div>

          <div className="footer-col">
            <h4 id="contact">Contact</h4>

            <a 
              href="https://www.linkedin.com/in/noem-ahmed-khan" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-linkedin"></i> Visit
            </a>

            <a href="mailto:noemahmedkhan8307@gmail.com">
              <i className="fa-solid fa-envelope"></i> noemahmedkhan8307@gmail.com
            </a>

            <a href="tel:+923452971536">
              <i className="fa-solid fa-phone"></i> +92 345 2971536
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2026 ContactHub. All rights reserved. | Your data is protected.
        </p>
      </div>
    </footer>
  );
};

export default Footer;