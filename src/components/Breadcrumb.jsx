import { Link, useLocation } from "react-router-dom";
import "../assets/css/breadcrumb.css";

export default function Breadcrumb() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const formatName = (name) => {
    return name
      .replace("-", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="breadcrumb-container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <span key={to} className="breadcrumb-item">
              <span className="separator">›</span>
              {isLast ? (
                <span className="current">
                  {formatName(value)}
                </span>
              ) : (
                <Link to={to}>{formatName(value)}</Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}