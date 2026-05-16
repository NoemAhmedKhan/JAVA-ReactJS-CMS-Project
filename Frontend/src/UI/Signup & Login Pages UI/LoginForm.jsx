import { useNavigate } from "react-router-dom";
import "./__LoginForm.css";

const LoginForm = () => {

  const navigate = useNavigate();

  return (
    <>
{/* LOGIN FORM */}
            <form noValidate>

              {/* EMAIL */}
              <div className="form-group">

                <label htmlFor="email" className="form-label">
                  Email Address
                </label>

                <div className="input-wrap">
                  <span className="input-icon">
                    <i className="fas fa-envelope"></i>
                  </span>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="yourname@gmail.com"
                    autoComplete="email"
                  />
                </div>

              </div>

              {/* PASSWORD */}
              <div className="form-group">

                <div className="label-row">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>

                  <a className="forgot-link">
                    Forgot password?
                  </a>
                </div>

                <div className="input-wrap">

                  <span className="input-icon">
                    <i className="fas fa-lock"></i>
                  </span>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button type="button" className="eye-toggle">
                    <i className="fas fa-eye"></i>
                  </button>

                </div>

              </div>

              {/* SUBMIT */}
              <button type="submit" className="btn-submit">

                <span className="btn-text">Sign In</span>

                <span className="btn-spinner">
                  <i className="fas fa-circle-notch fa-spin"></i>
                </span>

                <i className="fas fa-arrow-right btn-arrow"></i>

              </button>

            </form>

            {/* FOOTER LINK */}
            <p className="auth-footer-link">
              Don't have an account?{" "}
              <div
                onClick={ () => { navigate('/signup') }}
              >
                Create Account
              </div>
            </p>

    </>
  );
};

export default LoginForm;