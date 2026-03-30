// PageLoader.tsx — fullscreen loading spinner shown between route transitions
// Appears only while a lazy-loaded page chunk is being downloaded (usually < 1s)
// After first visit, chunks are cached so this rarely appears again

export default function PageLoader() {
  return (
    <div style={{
      position:       "fixed",
      inset:          0,
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      background:     "#fff",
      zIndex:         9999,
      gap:            "16px",
    }}>
      {/* Spinning ring */}
      <div style={{
        width:        "44px",
        height:       "44px",
        border:       "3px solid #f0f0f0",
        borderTop:    "3px solid #3A9D23",
        borderRadius: "50%",
        animation:    "kcee-spin 0.7s linear infinite",
      }} />

      {/* Brand name */}
      <p style={{
        fontSize:      "22px",
        fontWeight:    "bold",
        color:         "#3A9D23",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontFamily:    "Cinzel Decorative",
      }}>
        Kcee_Collection
      </p>

      {/* Inline keyframes — no CSS file needed */}
      <style>{`
        @keyframes kcee-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
