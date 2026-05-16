import { useNavigate } from "react-router-dom";
import "./__SignupForm.css";

const SignupForm = () => {

  const navigate = useNavigate();

  return (
    <>
    {/* SIGNUP FORM */}
            <form id="signupForm" noValidate>
              {/* Full Name */}
              <div className="form-group" id="fgName">
                <label className="form-label" htmlFor="fullname">
                  Full Name
                </label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    className="form-input"
                    placeholder="Mr. Ahmed"
                    autoComplete="name"
                  />
                </div>
                <span className="form-error" id="nameErr"></span>
              </div>

              {/* Email */}
              <div className="form-group" id="fgEmail">
                <label className="form-label" htmlFor="email">
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
                <span className="form-error" id="emailErr"></span>
              </div>

              {/* Password */}
              <div className="form-group" id="fgPassword">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="eye-toggle"
                    id="eyeToggle1"
                    aria-label="Toggle password"
                  >
                    <i className="fas fa-eye" id="eyeIcon1"></i>
                  </button>
                </div>
            </div>

              {/* Confirm Password */}
              <div className="form-group" id="fgConfirm">
                <label className="form-label" htmlFor="confirm">
                  Confirm Password
                </label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    id="confirm"
                    name="confirm"
                    className="form-input"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="eye-toggle"
                    id="eyeToggle2"
                    aria-label="Toggle confirm password"
                  >
                    <i className="fas fa-eye" id="eyeIcon2"></i>
                  </button>
                </div>

                <span className="form-error" id="confirmErr"></span>
              </div>

             
              {/* Submit */}
              <button type="submit" className="btn-submit" id="submitBtn">
                <span className="btn-text">Create Account</span>
                <span className="btn-spinner" id="spinner">
                  <i className="fas fa-circle-notch fa-spin"></i>
                </span>
                <i className="fas fa-arrow-right btn-arrow" id="btnArrow"></i>
              </button>
            </form>

            <p className="auth-footer-link">
              Already have an account? <div onClick={ () => { navigate('/login') }}>Sign in</div>
            </p>
</>
            );
};

export default SignupForm;