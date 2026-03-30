import { useCart } from "../context/useCart";
import { DURATION, ICONS, STYLES } from "../utils/toastConfig";

// ✅ Zero state, zero effects — fully derived from context
// Slide-in: CSS animation fires on mount automatically
// Dismiss: calls showToast(null) directly, component unmounts cleanly
export default function Toast() {
  const { toast, showToast } = useCart();

  if (!toast) return null;

  const type = toast.type || "success";
  const s    = STYLES[type] || STYLES.success;
  const icon = ICONS[type]  || ICONS.success;

  return (
    <>
      <style>{`
        .kc-toast-wrap {
          position: fixed;
          bottom: 28px;
          right: 24px;
          z-index: 9999;
          pointer-events: none;
        }

        .kc-toast {
          pointer-events: all;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 280px;
          max-width: 360px;
          padding: 14px 16px 14px 14px;
          border-radius: 12px;
          border: 1px solid ${s.border};
          background: #fff;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
          animation: kc-slide-in 0.32s cubic-bezier(.22,1,.36,1) both;
        }

        @keyframes kc-slide-in {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        .kc-toast-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: ${s.light};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 16px;
          color: ${s.bg};
        }

        .kc-toast-body { flex: 1; min-width: 0; }

        .kc-toast-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: ${s.bg};
          margin-bottom: 2px;
        }

        .kc-toast-msg {
          font-size: 13px;
          font-weight: 500;
          color: #222;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .kc-toast-close {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          color: #bbb;
          padding: 2px 4px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .kc-toast-close:hover { color: #555; }

        .kc-toast-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 100%;
          background: ${s.bg};
          opacity: 0.35;
          transform-origin: left;
          animation: kc-bar ${DURATION}ms linear forwards;
        }

        @keyframes kc-bar {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }

        @media (max-width: 480px) {
          .kc-toast-wrap { bottom: 16px; right: 12px; left: 12px; }
          .kc-toast { max-width: 100%; min-width: unset; width: 100%; }
        }
      `}</style>

      <div className="kc-toast-wrap">
        <div className="kc-toast" role="alert" aria-live="polite">

          <div className="kc-toast-icon">
            <i className={`fas ${icon}`} />
          </div>

          <div className="kc-toast-body">
            <p className="kc-toast-label">{type}</p>
            <p className="kc-toast-msg">{toast.message}</p>
          </div>

          <button
            className="kc-toast-close"
            onClick={() => showToast(null)}
            aria-label="Dismiss"
          >
            <i className="fas fa-xmark" />
          </button>

          {/* key remounts this div on each new toast, restarting the animation */}
          <div className="kc-toast-bar" key={toast.message} />
        </div>
      </div>
    </>
  );
}
