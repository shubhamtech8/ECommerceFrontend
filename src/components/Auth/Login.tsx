import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import { login as loginUser } from "../../services/AuthService";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    setSuccessMessage("");
    setLoading(true);

    if (!loginData.email || !loginData.password) {
      setLoginError("All fields are required");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      setLoginError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(loginData.email, loginData.password);
      debugger;
      if (response.statusCode === 200) {
        setSuccessMessage("Login successful! Redirecting...");
        setLoginData({ email: "", password: "" });
        navigate("/home");
      } else if (response.statusCode === 404) {
        setLoginError("Invalid email or password");
      } else {
        setLoginError("Unexpected error occurred. Please try again.");
      }
    } catch (error: any) {
      setLoginError(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login</h1>
          <p>
            Don't have an account?{" "}
            <button
              className="toggle-btn"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </p>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleLoginSubmit} className="auth-form">
          {loginError && <div className="error-message">{loginError}</div>}

          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
