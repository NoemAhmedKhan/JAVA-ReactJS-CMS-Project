import './Header.css'

const Header = () => {

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-address-book"></i>
          </div>
          <span className="logo-text">
            Contact<span className="logo-accent">Hub</span>
          </span>
        </div>
        <nav className="nav">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </nav>
        <button className="hamburger" id="hamburger" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className="mobile-nav" id="mobileNav">
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
    </header>
  );
};

export default Header;