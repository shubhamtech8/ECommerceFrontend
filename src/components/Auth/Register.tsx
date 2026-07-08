import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import { register as registerUser } from "../../services/AuthService";

const Register = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    address: "",
    gender: "",
  });

  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError("");
    setSuccessMessage("");
    setLoading(true);

    // Validation
    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword ||
      !registerData.phone ||
      !registerData.age ||
      !registerData.gender
    ) {
      setRegisterError("All fields are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      setRegisterError("Please enter a valid email address");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      setRegisterError("Password must be at least 6 characters");
      return;
    }

    if (!/^\d{10}$/.test(registerData.phone.replace(/\D/g, ""))) {
      setRegisterError("Please enter a valid phone number");
      return;
    }

    const ageNum = parseInt(registerData.age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      setRegisterError("Age must be between 18 and 120");
      return;
    }

    try {
      const ageNum = parseInt(registerData.age);
      debugger;
      const response = await registerUser(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.phone,
        ageNum,
        registerData.gender,
        registerData.address,
      );
      console.log("Registration successful:", response);

      // Check if response is valid (not null or empty object)
      if (response && Object.keys(response).length > 0) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setRegisterData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          age: "",
          address: "",
          gender: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setRegisterError("Invalid response from server. Please try again.");
      }
    } catch (error: any) {
      setRegisterError(error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Register</h1>
          <p>
            Already have an account?{" "}
            <button className="toggle-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          </p>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleRegisterSubmit} className="auth-form">
          {registerError && (
            <div className="error-message">{registerError}</div>
          )}

          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input
              type="text"
              id="register-name"
              name="name"
              value={registerData.name}
              onChange={handleRegisterChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email Address</label>
            <input
              type="email"
              id="register-email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-phone">Phone Number</label>
            <input
              type="tel"
              id="register-phone"
              name="phone"
              value={registerData.phone}
              onChange={handleRegisterChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="register-age">Age</label>
              <input
                type="number"
                id="register-age"
                name="age"
                value={registerData.age}
                onChange={handleRegisterChange}
                placeholder="Enter your age"
                min="18"
                max="120"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-gender">Gender</label>
              <select
                id="register-gender"
                name="gender"
                value={registerData.gender}
                onChange={handleRegisterChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-address">Address</label>
            <input
              type="text"
              id="register-address"
              name="address"
              value={registerData.address}
              onChange={handleRegisterChange}
              placeholder="Enter your address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              type="password"
              id="register-password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              placeholder="Enter your password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password">Confirm Password</label>
            <input
              type="password"
              id="register-confirm-password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
