// ProfileSettings.tsx — with avatar upload via Cloudinary
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { formatDate } from "@/utils/format";
import { put } from "@/utils/api";
import UserAvatar from "@/components/UserAvatar";

const CLOUDINARY_URL    = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
}

type Tab = "info" | "password" | "account";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>("info");

  // Info form
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving,   setSaving]   = useState(false);
  const [infoMsg,  setInfoMsg]  = useState<{ ok: boolean; text: string } | null>(null);

  // Avatar upload
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMsg,       setAvatarMsg]       = useState<{ ok: boolean; text: string } | null>(null);

  // Password form
  const [curPw,    setCurPw]    = useState("");
  const [newPw,    setNewPw]    = useState("");
  const [showCur,  setShowCur]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg,    setPwMsg]    = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    setName(user.name   || "");
    setEmail(user.email || "");
    setPhone((user as User).phone || "");
  }, [user, navigate]);

  // ── Avatar upload ──────────────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!file.type.startsWith("image/")) {
      setAvatarMsg({ ok: false, text: "Please select an image file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarMsg({ ok: false, text: "Image must be under 5MB." });
      return;
    }

    setAvatarUploading(true);
    setAvatarMsg(null);

    try {
      // 1. Upload to Cloudinary
      const form = new FormData();
      form.append("file",   file);
      form.append("upload_preset", CLOUDINARY_PRESET);
      form.append("folder", "kcee_collection/avatars");

      const cloudRes = await fetch(CLOUDINARY_URL, { method: "POST", body: form });
      if (!cloudRes.ok) throw new Error("Cloudinary upload failed");
      const cloudData = await cloudRes.json();
      const avatarUrl: string = cloudData.secure_url;

      // 2. Save URL to backend
      await put("/api/auth/update-profile", { avatar: avatarUrl });

      // 3. Update AuthContext + localStorage
      updateUser({ avatar: avatarUrl });

      setAvatarMsg({ ok: true, text: "Photo updated successfully!" });
    } catch (err: unknown) {
      setAvatarMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Upload failed. Please try again.",
      });
    } finally {
      setAvatarUploading(false);
      // Reset input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // ── Save info ──────────────────────────────────────────────────────────────
  const saveInfo = async () => {
    setSaving(true); setInfoMsg(null);
    try {
      const data = await put<User>("/api/auth/update-profile", { name, email, phone });
      updateUser(data);
      setInfoMsg({ ok: true, text: "Profile updated successfully." });
    } catch (e: unknown) {
      setInfoMsg({ ok: false, text: e instanceof Error ? e.message : "Update failed." });
    } finally { setSaving(false); }
  };

  // ── Change password ────────────────────────────────────────────────────────
  const changePw = async () => {
    if (newPw.length < 6) { setPwMsg({ ok: false, text: "New password must be at least 6 characters." }); return; }
    setPwSaving(true); setPwMsg(null);
    try {
      await put("/api/auth/change-password", { currentPassword: curPw, newPassword: newPw });
      setPwMsg({ ok: true, text: "Password changed successfully." });
      setCurPw(""); setNewPw("");
    } catch (e: unknown) {
      setPwMsg({ ok: false, text: e instanceof Error ? e.message : "Failed to change password." });
    } finally { setPwSaving(false); }
  };

  const pwStrength      = newPw.length === 0 ? null : newPw.length < 6 ? "weak" : newPw.length < 10 ? "fair" : "strong";
  const pwStrengthColor = { weak: "#e53e3e", fair: "#d97706", strong: "#16a34a" }[pwStrength ?? "weak"];
  const pwStrengthWidth = { weak: "33%", fair: "66%", strong: "100%" }[pwStrength ?? "weak"];

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "info",     label: "Personal Info", icon: "fa-user"         },
    { key: "password", label: "Password",      icon: "fa-lock"         },
    { key: "account",  label: "Account",       icon: "fa-info-circle"  },
  ];

  return (
    <div style={s.page}>

      {/* ── HERO ── */}
      <div style={s.hero}>
        {/* Avatar with upload overlay */}
        <div style={s.avatarWrap}>
          <UserAvatar
            avatar={(user as User)?.avatar}
            name={user?.name || ""}
            size={72}
          />

          {/* Hidden file input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />

          {/* Camera button */}
          <button
            style={{
              ...s.cameraBtn,
              opacity: avatarUploading ? 0.6 : 1,
              cursor: avatarUploading ? "not-allowed" : "pointer",
            }}
            onClick={() => !avatarUploading && fileRef.current?.click()}
            title="Change profile photo"
            aria-label="Upload profile photo"
          >
            {avatarUploading
              ? <i className="fas fa-spinner fa-spin" style={{ fontSize: 11 }} />
              : <i className="fas fa-camera"          style={{ fontSize: 11 }} />
            }
          </button>
        </div>

        <div style={s.heroInfo}>
          <h1 style={s.heroName}>{user?.name || "—"}</h1>
          <p  style={s.heroEmail}>{user?.email || "—"}</p>

          {/* Avatar message inline */}
          {avatarMsg && (
            <p style={{ fontSize: 12, color: avatarMsg.ok ? "#16a34a" : "#e53e3e", marginTop: 4 }}>
              <i className={`fas ${avatarMsg.ok ? "fa-check" : "fa-exclamation-circle"}`} style={{ marginRight: 5 }} />
              {avatarMsg.text}
            </p>
          )}

          <div style={s.heroBadges}>
            <span style={s.roleBadge}>
              <i className="fas fa-circle" style={{ fontSize: 6, marginRight: 5, color: "#16a34a" }} />
              {(user as User)?.role === "admin" ? "Admin" : "Customer"}
            </span>
            {(user as User)?.createdAt && (
              <span style={s.sinceBadge}>
                <i className="fas fa-calendar-alt" style={{ marginRight: 5, opacity: 0.5 }} />
                Joined {formatDate((user as User).createdAt!)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={s.tabRow}>
        {TABS.map((t) => (
          <button
            key={t.key}
            style={{ ...s.tabBtn, ...(tab === t.key ? s.tabActive : {}) }}
            onClick={() => setTab(t.key)}
          >
            <i className={`fas ${t.icon}`} style={{ marginRight: 7, fontSize: 12 }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PERSONAL INFO ── */}
      {tab === "info" && (
        <div style={s.card}>
          <p style={s.cardTitle}>Edit Profile</p>
          {infoMsg && <Alert ok={infoMsg.ok} text={infoMsg.text} />}
          <div style={s.formGrid}>
            <Field label="Full Name">
              <input style={s.input} value={name}  onChange={(e) => setName(e.target.value)}  placeholder="Your full name" />
            </Field>
            <Field label="Email Address">
              <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
            </Field>
            <Field label="Phone Number" full>
              <input style={s.input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
            </Field>
          </div>
          <button style={{ ...s.saveBtn, opacity: saving ? 0.6 : 1 }} onClick={saveInfo} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      )}

      {/* ── PASSWORD ── */}
      {tab === "password" && (
        <div style={s.card}>
          <p style={s.cardTitle}>Change Password</p>
          {pwMsg && <Alert ok={pwMsg.ok} text={pwMsg.text} />}
          <div style={s.formGrid}>
            <Field label="Current Password" full>
              <div style={s.pwRow}>
                <input style={{ ...s.input, flex: 1 }} type={showCur ? "text" : "password"} value={curPw} onChange={(e) => setCurPw(e.target.value)} placeholder="Enter current password" />
                <button style={s.eyeBtn} onClick={() => setShowCur(!showCur)}>
                  <i className={`fas ${showCur ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </Field>
            <Field label="New Password" full>
              <div style={s.pwRow}>
                <input style={{ ...s.input, flex: 1 }} type={showNew ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Minimum 6 characters" />
                <button style={s.eyeBtn} onClick={() => setShowNew(!showNew)}>
                  <i className={`fas ${showNew ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
              {pwStrength && (
                <div style={{ marginTop: 8 }}>
                  <div style={s.pwTrack}>
                    <div style={{ ...s.pwFill, width: pwStrengthWidth, background: pwStrengthColor }} />
                  </div>
                  <p style={{ fontSize: 11, color: pwStrengthColor, marginTop: 4 }}>
                    {pwStrength.charAt(0).toUpperCase() + pwStrength.slice(1)}
                  </p>
                </div>
              )}
            </Field>
          </div>
          <button
            style={{ ...s.saveBtn, opacity: (pwSaving || !curPw || !newPw) ? 0.5 : 1 }}
            onClick={changePw}
            disabled={pwSaving || !curPw || !newPw}
          >
            {pwSaving ? "Changing…" : "Change Password"}
          </button>
        </div>
      )}

      {/* ── ACCOUNT INFO ── */}
      {tab === "account" && (
        <div style={s.card}>
          <p style={s.cardTitle}>Account Details</p>
          <div style={s.infoList}>
            {[
              { label: "Full Name",    value: user?.name },
              { label: "Email",        value: user?.email },
              { label: "Phone",        value: (user as User)?.phone || "Not set" },
              { label: "Role",         value: (user as User)?.role || "customer" },
              { label: "Member Since", value: (user as User)?.createdAt ? formatDate((user as User).createdAt!) : "—" },
              { label: "Account ID",   value: (user as User)?._id?.slice(-10) || "—", mono: true },
            ].map((row) => (
              <div key={row.label} style={s.infoRow}>
                <span style={s.infoLbl}>{row.label}</span>
                <span style={{ ...s.infoVal, ...(row.mono ? s.mono : {}) }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  );
}

function Alert({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div style={{
      ...s.alert,
      background:  ok ? "#f0fdf4" : "#fff5f5",
      borderLeft: `3px solid ${ok ? "#16a34a" : "#e53e3e"}`,
      color: ok ? "#15803d" : "#c53030",
    }}>
      <i className={`fas ${ok ? "fa-check-circle" : "fa-exclamation-circle"}`} style={{ marginRight: 8 }} />
      {text}
    </div>
  );
}

// ── STYLES ─────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page:  { padding: "32px 28px", maxWidth: 720, margin: "0 auto", fontFamily: "inherit" },
  hero:  { display: "flex", alignItems: "center", gap: 20, marginBottom: 32, padding: "24px", background: "#fff", borderRadius: 16, border: "1px solid #efefef" },
  avatarWrap: { position: "relative", flexShrink: 0 },
  heroInfo:  { flex: 1, minWidth: 0 },
  heroName:  { fontSize: 20, fontWeight: 700, margin: "0 0 3px", color: "#111", letterSpacing: "-0.3px" },
  heroEmail: { fontSize: 13, color: "#888", margin: "0 0 10px" },
  heroBadges: { display: "flex", gap: 8, flexWrap: "wrap" as const },
  roleBadge:  { fontSize: 11, fontWeight: 600, padding: "3px 10px", background: "#f0fdf4", color: "#15803d", borderRadius: 20, display: "inline-flex", alignItems: "center" },
  sinceBadge: { fontSize: 11, padding: "3px 10px", background: "#f5f5f5", color: "#666", borderRadius: 20, display: "inline-flex", alignItems: "center" },

  // Camera upload button
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "var(--design-color, #111)",
    color: "#fff",
    border: "2px solid #fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.15s",
  },

  tabRow:    { display: "flex", gap: 6, marginBottom: 20, background: "#f5f5f5", padding: 4, borderRadius: 12 },
  tabBtn:    { flex: 1, padding: "9px 12px", border: "none", background: "transparent", borderRadius: 9, fontSize: 13, fontWeight: 500, color: "#666", cursor: "pointer", transition: "all 0.15s" },
  tabActive: { background: "#fff", color: "#111", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  card:      { background: "#fff", borderRadius: 16, border: "1px solid #efefef", padding: "24px" },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#111", margin: "0 0 20px", letterSpacing: "-0.2px" },
  formGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  label:     { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, letterSpacing: "0.02em", textTransform: "uppercase" as const },
  input:     { width: "100%", padding: "10px 12px", border: "1px solid #e5e5e5", borderRadius: 9, fontSize: 14, color: "#111", background: "#fafafa", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit", transition: "border-color 0.15s" },
  pwRow:     { display: "flex", gap: 8, alignItems: "center" },
  eyeBtn:    { padding: "10px 13px", border: "1px solid #e5e5e5", borderRadius: 9, background: "#fafafa", cursor: "pointer", color: "#666", fontSize: 13, flexShrink: 0 },
  pwTrack:   { height: 3, background: "#eee", borderRadius: 99, overflow: "hidden" },
  pwFill:    { height: "100%", borderRadius: 99, transition: "width 0.3s, background 0.3s" },
  saveBtn:   { padding: "11px 28px", background: "var(--design-color, #111)", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "opacity 0.15s" },
  alert:     { padding: "10px 14px", borderRadius: 9, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center" },
  infoList:  { display: "flex", flexDirection: "column" as const },
  infoRow:   { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "1px solid #f5f5f5" },
  infoLbl:   { fontSize: 13, color: "#888" },
  infoVal:   { fontSize: 13, fontWeight: 500, color: "#111" },
  mono:      { fontFamily: "monospace", fontSize: 12, color: "#555" },
};
