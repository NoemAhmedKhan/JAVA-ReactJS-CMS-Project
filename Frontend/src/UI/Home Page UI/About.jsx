import './About.css';
import { useNavigate } from "react-router-dom";

const About = () => {

  const navigate = useNavigate();

  return (
    <section className="hero" id="about">
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
          <button type='button' className="btn-primary" onClick={ () => { navigate('/signup') }}>
            <span>Start for Free</span>
            <i className="fas fa-arrow-right"></i>
          </button>
          <button type='button' className="btn-ghost" onClick={ () => { navigate('/login') }}>
            <i className="fas fa-sign-in-alt"></i>
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default About