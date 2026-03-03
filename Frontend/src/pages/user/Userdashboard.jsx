import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import UserDropdown from "../../components/UserDropdown";
import "../../assets/css/profileSettings.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ProfileSettings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({ name: "", email: "", phone: "" });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwData, setPwData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth"); return; }
    setProfileData({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
  }, [user, loading, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      setProfileMsg({ type: "", text: "" });
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/api/auth/update-profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.msg || "Failed to update profile" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (pwData.newPassword.length < 6) {
      setPwMsg({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    try {
      setPwLoading(true);
      setPwMsg({ type: "", text: "" });
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/api/auth/change-password`,
        { currentPassword: pwData.currentPassword, newPassword: pwData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPwMsg({ type: "success", text: "Password changed successfully!" });
      setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.msg || "Failed to change password" });
    } finally {
      setPwLoading(false);
    }
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "";

  return (
    <>
      <div className="ps-wrap">

        <div className="ps-header">
          <div>
            <h1 className="ps-title">Profile Settings</h1>
            <p className="ps-sub">Manage your account details</p>
          </div>
          <UserDropdown />
        </div>

        {/* Avatar Card */}
        <div className="ps-card" style={{ marginBottom: "24px" }}>
          <div className="ps-avatar-section">
            <div className="ps-avatar">{initial}</div>
            <div>
              <div className="ps-avatar-name">{user?.name || "User"}</div>
              <div className="ps-avatar-email">{user?.email || ""}</div>
              {memberSince && <div className="ps-avatar-member">Member since {memberSince}</div>}
            </div>
          </div>
        </div>

        <div className="ps-grid">

          {/* Update Profile */}
          <div className="ps-card">
            <div className="ps-card-header">
              <div className="ps-card-icon blue"><i className="fa-solid fa-user-pen"></i></div>
              <div>
                <div className="ps-card-title">Personal Information</div>
                <div className="ps-card-desc">Update your name, email and phone</div>
              </div>
            </div>
            <div className="ps-card-body">
              {profileMsg.text && (
                <div className={`ps-alert ${profileMsg.type}`}>{profileMsg.text}</div>
              )}
              <form onSubmit={handleProfileUpdate}>
                <div className="ps-field">
                  <label className="ps-label">Full Name</label>
                  <input className="ps-input" type="text" placeholder="Your full name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                </div>
                <div className="ps-field">
                  <label className="ps-label">Email Address</label>
                  <input className="ps-input" type="email" placeholder="Your email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                </div>
                <div className="ps-field">
                  <label className="ps-label">Phone Number</label>
                  <input className="ps-input" type="text" placeholder="Your phone number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                </div>
                <button type="submit" className="ps-btn green" disabled={profileLoading}>
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="ps-card">
            <div className="ps-card-header">
              <div className="ps-card-icon orange"><i className="fa-solid fa-lock"></i></div>
              <div>
                <div className="ps-card-title">Change Password</div>
                <div className="ps-card-desc">Keep your account secure</div>
              </div>
            </div>
            <div className="ps-card-body">
              {pwMsg.text && (
                <div className={`ps-alert ${pwMsg.type}`}>{pwMsg.text}</div>
              )}
              <form onSubmit={handlePasswordChange}>
                {[
                  { key: "currentPassword", label: "Current Password", show: showPw.current, toggle: () => setShowPw(p => ({ ...p, current: !p.current })) },
                  { key: "newPassword", label: "New Password", show: showPw.new, toggle: () => setShowPw(p => ({ ...p, new: !p.new })) },
                  { key: "confirmPassword", label: "Confirm New Password", show: showPw.confirm, toggle: () => setShowPw(p => ({ ...p, confirm: !p.confirm })) },
                ].map(({ key, label, show, toggle }) => (
                  <div className="ps-field" key={key}>
                    <label className="ps-label">{label}</label>
                    <div className="ps-pw-wrap">
                      <input
                        className="ps-input"
                        type={show ? "text" : "password"}
                        placeholder="••••••••"
                        value={pwData[key]}
                        style={{ paddingRight: "40px" }}
                        onChange={(e) => setPwData({ ...pwData, [key]: e.target.value })}
                      />
                      <button type="button" className="ps-pw-toggle" onClick={toggle}>
                        <i className={`fa-solid ${show ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" className="ps-btn green" disabled={pwLoading}>
                  {pwLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
