import { useState } from "react";

const INITIAL = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
};

const useContactForm = (initial = INITIAL) => {
  const [formData, setFormData] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (formData.phone && !/^\+?[\d\s\-().]{7,15}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setFormData(initial);
    setErrors({});
  };

  return { formData, setFormData, errors, loading, setLoading, handleChange, validate, reset };
};

export default useContactForm;
