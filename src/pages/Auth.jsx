import { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig.js";
import { OAuthProvider } from "firebase/auth";
import "../assets/css/auth.css";
import logo from "../assets/My_Collections/Logo/Kceecollection_Logo2.jpeg";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import google from "../assets/Icons/google.png";
import apple from "../assets/Icons/apple.png";
import facebook from "../assets/Icons/facebook.png";
import instagram from "../assets/Icons/instagram.png";

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [UserName, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      setErrorMessage("Please accept the Terms & Conditions");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setErrorMessage("Password reset email sent!");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>

      <div className="auth-wrapper">
        <div className={`auth-box ${isSignup ? "signup-active" : ""}`}>
          {/* LOGIN PANEL */}
          <div className="panel panel-left">
            <h2>Login</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email or Username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <a href="#" className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</a>
              <button type="submit" className="login-btn">Login</button>
              <p className="login-link mobile-only">
                Don't have an account?{" "}
                <span onClick={() => setIsSignup(true)}>Sign Up</span>
              </p>
            </form>
            <div className="social-login">
              <button
                type="button"
                className="social-btn google-btn"
                onClick={() => handleSocialLogin(new GoogleAuthProvider())}
              >
                <img
                  src={google}        
                  alt="Google"
                  className="social-icon"
                  style={{ width: '24px', height: '24px' }} 
                />
                <span className="tooltip">Google</span>
              </button>
              <button
                type="button"
                className="social-btn apple-btn"
                onClick={() => handleSocialLogin(new OAuthProvider("apple.com"))}
              >
                <img
                  src={apple}        
                  alt="Apple"
                  className="social-icon"
                  style={{ width: '24px', height: '24px' }}
                />
                <span className="tooltip">Apple</span>
              </button>
              <button
                type="button"
                className="social-btn facebook-btn"
                onClick={() => handleSocialLogin(new FacebookAuthProvider())}
              >
                <img
                  src={facebook}       
                  alt="Facebook"
                  className="social-icon facebook-icon"
                  style={{ width: '24px', height: '24px' }} 
                />
                <span className="tooltip">Facebook</span>
              </button>
              <button
                type="button"
                className="social-btn"
              >
                <img
                  src={instagram}       
                  alt="Instagram"
                  className="social-icon instagram-icon"
                  style={{ width: '24px', height: '24px' }} 
                />
                <span className="tooltip">Instagram</span>
              </button>
            </div>
          </div>

          {/* SIGNUP PANEL */}
          <div className="panel panel-right">
            <h2>Create Account</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                required
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label className="terms-label">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                I accept the Terms & Conditions
              </label>
              <button type="submit" className="signup-btn">Sign Up</button>
              <p className="login-link mobile-only">
                Already have an account?{" "}
                <span onClick={() => setIsSignup(false)}>Login</span>
              </p>
            </form>
            <div className="social-login">
              <button
                type="button"
                className="social-btn google-btn"
                onClick={() => handleSocialLogin(new GoogleAuthProvider())}
              >
                <img
                  src={google}        
                  alt="Google"
                  className="social-icon"
                  style={{ width: '24px', height: '24px' }} 
                />
                <span className="tooltip">Google</span>
              </button>
              <button
                type="button"
                className="social-btn apple-btn"
                onClick={() => handleSocialLogin(new OAuthProvider("apple.com"))}
              >
                <img
                  src={apple}        
                  alt="Apple"
                  className="social-icon"
                  style={{ width: '24px', height: '24px' }}
                />
                <span className="tooltip">Apple</span>
              </button>
              <button
                type="button"
                className="social-btn facebook-btn"
                onClick={() => handleSocialLogin(new FacebookAuthProvider())}
              >
                <img
                  src={facebook}       
                  alt="Facebook"
                  className="social-icon facebook-icon"
                  style={{ width: '24px', height: '24px' }} 
                />
                <span className="tooltip">Facebook</span>
              </button>
              <button
                type="button"
                className="social-btn"
              >
                <img
                  src={instagram}       
                  alt="Instagram"
                  className="social-icon instagram-icon"
                  style={{ width: '24px', height: '24px' }} 
                />
                <span className="tooltip">Instagram</span>
              </button>
            </div>
          </div>

          {/* OVERLAY */}
          <div className="overlay">
            <div className="auth-brand">
              <img src={logo} alt="Kcee Collection Logo" />
            </div>
            <div className="overlay-panel overlay-right">
              <h2>New Here?</h2>
              <p>Create an account to start shopping.</p>
              <button onClick={() => setIsSignup(true)}>
                Sign Up
              </button>
            </div>

            <div className="overlay-panel overlay-left">
              <h2>Welcome Back!</h2>
              <p>Login to continue shopping.</p>
              <button onClick={() => setIsSignup(false)}>
                Login
              </button>
            </div>
          </div>
        </div>
    </div>
    
    </>
  );
}

export default Auth;