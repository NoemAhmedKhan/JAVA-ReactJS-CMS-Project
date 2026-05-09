import { useNavigate } from "react-router-dom";
import "./__Header.css";

const __Header = (props) => {

  const navigate = useNavigate();

  return (
<header className="auth-header">
        <div className="logo" onClick={ () => { navigate('/') }}>
          <div className="logo-icon">
            <i className="fas fa-address-book"></i>
          </div>
          <span className="logo-text">
            Contact<span className="logo-accent">Hub</span>
          </span>
        </div>

        <div className="header-switch" onClick={ () => { (props.auth === "Sign Up")? navigate('/signup'): navigate('/login') }}>
          (props.auth === "Sign Up")? "Already have an account?": "Don't have an account?" <strong>{props.auth}</strong>
        </div>
      </header>
  );
};

export default __Header;
