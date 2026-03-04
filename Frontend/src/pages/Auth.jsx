import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/auth.css";
import crown from "../assets/Icons/crown.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import SEO from "../components/SEO";

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, forgotPassword } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (password !== confirmPassword) return setErrorMessage("Passwords do not match");
    if (!termsAccepted) return setErrorMessage("Please accept the Terms & Conditions");
    try {
      await register(fullName, email, password, phone);
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.response?.data?.msg || "Signup failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await login(email, password);
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.response?.data?.msg || "Login failed");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return setErrorMessage("Please enter your email address");
    try {
      await forgotPassword(email);
      setErrorMessage("Password reset email sent!");
    } catch (err) {
      setErrorMessage(err.response?.data?.msg || "Error sending reset email");
    }
  };

  return (
    <div className="auth-wrapper">
      <SEO
        title={isSignup ? "Create Account" : "Login"}
        description={isSignup ? "Create a Kcee Collection account to start shopping." : "Login to your Kcee Collection account."}
        image="https://kceecollection.com/og-image.jpg"
        url="https://kceecollection.com/auth"
      />
      <div className={`auth-box ${isSignup ? "signup-active" : ""}`}>

        {/* LOGIN PANEL */}
        <div className="panel panel-left">
          <h2>Login</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="password-container">
              <input type={showPassword ? "text" : "password"} placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</div>
            <button type="submit" className="login-btn">Login</button>
            <p className="login-link mobile-only">Don't have an account?{" "}<span onClick={() => setIsSignup(true)}>Sign Up</span></p>
          </form>
        </div>

        {/* SIGNUP PANEL */}
        <div className="panel panel-right">
          <h2>Create Account</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleSignup}>
            <input type="text" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="password-container">
              <input type={showPassword ? "text" : "password"} placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <label className="terms-label">
              <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
              I accept the Terms & Conditions
            </label>
            <button type="submit" className="signup-btn">Sign Up</button>
            <p className="login-link mobile-only">Already have an account?{" "}<span onClick={() => setIsSignup(false)}>Login</span></p>
          </form>
        </div>

        {/* OVERLAY */}
        <div className="overlay">
          <div to="/" className="auth-brand">
            <h1>KceeCollection</h1>
            <img src={crown} alt="Kceecollection Crown Icon" className="crown"
              style={{ width: "20px", height: "20px" }} />
          </div>
          <div className="overlay-panel overlay-right">
            <h2>New Here?</h2>
            <p>Create an account to start shopping.</p>
            <button onClick={() => setIsSignup(true)}>Sign Up</button>
          </div>
          <div className="overlay-panel overlay-left">
            <h2>Welcome Back!</h2>
            <p>Login to continue shopping.</p>
            <button onClick={() => setIsSignup(false)}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
