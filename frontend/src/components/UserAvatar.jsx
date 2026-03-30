// UserAvatar.jsx — reusable avatar: shows photo if available, initials otherwise
// Props:
//   avatar  : string | undefined  — Cloudinary URL
//   name    : string              — used to generate initials fallback
//   size    : number              — diameter in px (default 40)
//   style   : object             — extra inline styles

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?";

export default function UserAvatar({ avatar, name = "", size = 40, style = {} }) {
  const base = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    ...style,
  };

  if (avatar) {
    return (
      <div style={base}>
        <img
          src={avatar}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            // fallback to initials if image fails to load
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.setAttribute("data-fallback", "true");
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...base,
        background: "var(--design-color, #111)",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.35,
        letterSpacing: "-0.5px",
      }}
    >
      {getInitials(name)}
    </div>
  );
}
