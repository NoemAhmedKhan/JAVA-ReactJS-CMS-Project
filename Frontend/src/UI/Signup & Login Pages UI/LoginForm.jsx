import { useNavigate } from "react-router-dom";
import "./__LoginForm.css";
import { useState } from "react";

const LoginForm = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({email: "", password: ""});
  const [errors, setErrors] = useState({emailError: '', passwordError: ''});
  const [showPassword, setShowPassword] = useState(false);

  const getFields = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value});
  };

  const validateFields = (formData) => {
    let copyErrors = {emailError: '', passwordError: ''};

    if (!(formData.email.toLowerCase().includes("@gmail.com")) || formData.email === "")
      copyErrors.emailError = "Invalid Email! Must be @gmail.com.";

    if (formData.password.length < 8 || formData.password.length > 16 || formData.password.length === 0)
      copyErrors.passwordError = "Invalid Password! Password should be min. of '8' max. of '16' characters.";

    setErrors(copyErrors);
    for (const key in copyErrors) {
      if (copyErrors[key] !== "") return false;
    }
    return true;
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const isValid = validateFields(formData);
    if (isValid) {
      fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          password: formData.password,
        })
      })
        .then(async (res) => {
          const text = await res.text();
          return text ? JSON.parse(text) : {};
        })
        .then(data => {
          if (data.token) {
            localStorage.setItem("TOKEN", data.token);
            navigate("/dashboard");
          }
          console.log(data.message);
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <>
      <form noValidate>

        {/* EMAIL */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
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

        {/* PASSWORD */}
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="password" className="form-label">Password</label>
          </div>
          <div className="input-wrap">
            <span className="input-icon"><i className="fas fa-lock"></i></span>
            <input
              type={showPassword ? "text" : "password"}
              id="password" name="password"
              className="form-input"
              placeholder="Enter your password"
              autoComplete="current-password"
              onChange={getFields}
            />
            <button type="button" className="eye-toggle" aria-label="Toggle password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className="fas fa-eye"></i>
            </button>
          </div>
          <span className="form-error">{errors.passwordError}</span>
        </div>

        <button type="button" className="btn-submit" onClick={handleLogin}>
          <span className="btn-text">Sign In</span>
          <span className="btn-spinner"><i className="fas fa-circle-notch fa-spin"></i></span>
          <i className="fas fa-arrow-right btn-arrow"></i>
        </button>

      </form>

      <p className="auth-footer-link">
        Don't have an account?{" "}
        <span onClick={() => navigate('/signup')}>Create Account</span>
      </p>
    </>
  );
};

export default LoginForm;