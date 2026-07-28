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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Required: First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    // Required: Email
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    // Required: Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+?[\d\s\-().]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number.";
    }

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
