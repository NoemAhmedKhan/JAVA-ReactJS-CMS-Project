import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./__SignupForm.css";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({fullname: "", email: "", password: "", confirm: ""})
  const [errors, setErrors] = useState({nameError: '', emailError: '', passwordError: '', confirmPasswordError: ''});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getFields = (event) => {
    setFormData(
        {...formData,
          [event.target.name]: event.target.value
        })
  }

  const validateFields = (formData) => {
    // VALIDATION HANDLING
    let copyErrors = {
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: ''
    };

    if ( formData.fullname.trim() === "" ) copyErrors.nameError = "Name can not be empty! Fill Your Name.";
    else copyErrors.nameError = "";

    if ( !(formData.email.toLowerCase().includes("@gmail.com")) || formData.email === "" ) copyErrors.emailError = "Invalid Email! Must be @gmail.com.";
    else copyErrors.emailError = "";

    // Password Length Checker
    if ( formData.password.length < 8 || formData.password.length > 16 || formData.password.length === 0 ) {
      copyErrors.passwordError = "Invalid Password! Password should be min. of '8' max. of '16' characters.";
    }
    else{
      copyErrors.passwordError = "";
      // At least 1 number, 1 special character, and Min. 8 characters.
      // Password Regex
      const passRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/;
      if ( !(passRegex.test(formData.password)) ) copyErrors.passwordError = "Invalid Password! Must contain at least one digit, special character, and upper case letter.";
      else copyErrors.passwordError = "";
    }

    // Confirm Password Validation
    if ( !(formData.confirm === formData.password) || formData.confirm.length === 0 ) copyErrors.confirmPasswordError = "Confirm Password is not similar.";
    else copyErrors.confirmPasswordError = "";

    setErrors(copyErrors);

    for (const key in copyErrors) {
      if ( copyErrors[key] !== "" ) return false;
    }

    return true;
  }

  const handleSignup = (event) => {
    event.preventDefault();
    const isValid = validateFields(formData);

    //   SEND REQUEST TO BACKEND THROUGH FETCH()
    if (isValid) {
      fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Data must be a string
      })
          .then(response => response.json())
          .then(result => console.log('Success:', result));
    }
  }
  return (
    <>
    {/* SIGNUP FORM */}
            <form id="signupForm">
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
                    onChange={getFields}
                  />
                </div>
                <span className="form-error" id="nameErr">
                  {errors.nameError}
                </span>
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
                    onChange={getFields}
                  />
                </div>
                <span className="form-error" id="emailErr">
                  {errors.emailError}
                </span>
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    onChange={getFields}
                  />

                  <button
                    type="button"
                    className="eye-toggle"
                    id="eyeToggle1"
                    aria-label="Toggle password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className="fas fa-eye" id="eyeIcon1"></i>
                  </button>
                </div>

                <span className="form-error" id="passwordErr">
                  {errors.passwordError}
                </span>
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
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm"
                    name="confirm"
                    className="form-input"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    onChange={getFields}
                  />

                  <button
                    type="button"
                    className="eye-toggle"
                    id="eyeToggle2"
                    aria-label="Toggle confirm password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className="fas fa-eye" id="eyeIcon2"></i>
                  </button>
                </div>

                <span className="form-error" id="confirmErr">
                  {errors.confirmPasswordError}
                </span>
              </div>

             
              {/* Submit */}
              <button type="button" className="btn-submit" id="submitBtn" onClick={handleSignup} >
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