import { useNavigate } from "react-router-dom";


export default function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="back-btn-container">
      <button onClick={handleBack}>
        ← Back
      </button>
    </div>
  );
}