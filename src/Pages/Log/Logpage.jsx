import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Authcontex";
import "./Logpage.css"; // you can keep your styles and tweak

const BASE_URL = "https://dripg.onrender.com";

const LoginPage = () => {
  const { setUser, handleLoginSuccess } = useContext(AuthContext);
  const navigator=useNavigate("/")

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/user/login" : "/user/signup";
      const res = await axios.post(`${BASE_URL}${endpoint}`, form, { withCredentials: true });

      if (res.data?.success && res.data.user) {
        setUser(res.data.user);
        navigator("/")

        // 🔁 Retry pending actions like add-to-cart
        if (handleLoginSuccess) await handleLoginSuccess();
      } else {
        setError("Authentication failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            role="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(""); // clear previous errors
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
