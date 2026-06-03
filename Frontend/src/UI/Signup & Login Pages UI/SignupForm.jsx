import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./__SignupForm.css";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({fullname: "", email: "", password: "", confirm: ""});
  const [errors, setErrors] = useState({nameError: '', emailError: '', passwordError: '', confirmPasswordError: ''});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getFields = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value});
  };

  const validateFields = (formData) => {
    let copyErrors = {
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: ''
    };

    if (formData.fullname.trim() === "")
      copyErrors.nameError = "Name can not be empty! Fill Your Name.";

    if (!(formData.email.toLowerCase().includes("@gmail.com")) || formData.email === "")
      copyErrors.emailError = "Invalid Email! Must be @gmail.com.";

    if (formData.password.length < 8 || formData.password.length > 16 || formData.password.length === 0) {
      copyErrors.passwordError = "Invalid Password! Password should be min. of '8' max. of '16' characters.";
    } else {
      const passRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/;
      if (!(passRegex.test(formData.password)))
        copyErrors.passwordError = "Invalid Password! Must contain at least one digit, special character, and upper case letter.";
    }

    if (!(formData.confirm === formData.password) || formData.confirm.length === 0)
      copyErrors.confirmPasswordError = "Confirm Password is not similar.";

    setErrors(copyErrors);
    for (const key in copyErrors) {
      if (copyErrors[key] !== "") return false;
    }
    return true;
  };

  const handleSignup = (event) => {
    event.preventDefault();
    const isValid = validateFields(formData);
    if (isValid) {
      fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          fullName: formData.fullname,
          email: formData.email.toLowerCase(),
          password: formData.password,
        })
      })
        .then(response => response.text())
        .then(result => console.log('Success:', result))
        .catch(error => console.log(error));
    }
  };

  return (
    <>
      <form noValidate>

        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="fullname">Full Name</label>
          <div className="input-wrap">
            <span className="input-icon"><i className="fas fa-user"></i></span>
            <input
              type="text" id="fullname" name="fullname"
              className="form-input"
              placeholder="Mr. Ahmed"
              autoComplete="name"
              onChange={getFields}
            />
          </div>
          <span className="form-error">{errors.nameError}</span>
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <div className="input-wrap">
            <span className="input-icon"><i className="fas fa-envelope"></i></span>
            <input
              type="email" id="email" name="email"
              className="form-input"
              placeholder="yourname@gmail.com"
              autoComplete="email"
              onChange={getFields}
            />
          </div>
          <span className="form-error">{errors.emailError}</span>
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="input-wrap">
            <span className="input-icon"><i className="fas fa-lock"></i></span>
            <input
              type={showPassword ? "text" : "password"}
              id="password" name="password"
              className="form-input"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              onChange={getFields}
            />
            <button
              type="button" className="eye-toggle"
              aria-label="Toggle password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className="fas fa-eye"></i>
            </button>
          </div>
          <span className="form-error">{errors.passwordError}</span>
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="confirm">Confirm Password</label>
          <div className="input-wrap">
            <span className="input-icon"><i className="fas fa-lock"></i></span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm" name="confirm"
              className="form-input"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              onChange={getFields}
            />
            <button
              type="button" className="eye-toggle"
              aria-label="Toggle confirm password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className="fas fa-eye"></i>
            </button>
          </div>
          <span className="form-error">{errors.confirmPasswordError}</span>
        </div>

        <button type="button" className="btn-submit" onClick={handleSignup}>
          <span className="btn-text">Create Account</span>
          <span className="btn-spinner"><i className="fas fa-circle-notch fa-spin"></i></span>
          <i className="fas fa-arrow-right btn-arrow"></i>
        </button>

      </form>

      <p className="auth-footer-link">
        Already have an account? <span onClick={() => navigate('/login')}>Sign in</span>
      </p>
    </>
  );
};

export default SignupForm;