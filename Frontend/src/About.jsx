import './About.css';

const About = () => {
  return (
    <section className="hero" id="about">
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          Your Contacts,
          <br />
          <span className="gradient-text">Perfectly Organized</span>
        </h1>
        <p className="hero-subtitle">
          Manage your contacts efficiently and securely — one smart platform for
          all of your relationships.
        </p>
        <div className="hero-cta">
          <a href="signup.html" className="btn-primary">
            <span>Start for Free</span>
            <i className="fas fa-arrow-right"></i>
          </a>
          <a href="login.html" className="btn-ghost">
            <i className="fas fa-sign-in-alt"></i>
            <span>Sign In</span>
          </a>
        </div>
      </div>
    </section>
  );
};


export default About