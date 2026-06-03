import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
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
          <button className="nav-link" onClick={() => scrollToSection('features')}>Features</button>
          <button className="nav-link" onClick={() => scrollToSection('about')}>About</button>
          <button className="nav-link" onClick={() => scrollToSection('contact')}>Contact</button>
        </nav>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>

      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <button onClick={() => scrollToSection('features')}>Features</button>
        <button onClick={() => scrollToSection('about')}>About</button>
        <button onClick={() => scrollToSection('contact')}>Contact</button>
      </div>

    </header>
  );
};

export default Header;