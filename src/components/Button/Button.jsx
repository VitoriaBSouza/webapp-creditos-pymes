import "./Button.css";
import { useNavigate } from "react-router-dom";
import { ButtonActions } from "./ButtonActions";
export default function Button({
  text,
  color = "primary",
  size = "md",
  className = "",
  action = "alert",
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();

    if (typeof action === "string" && ButtonActions[action]) {
      ButtonActions[action](navigate);
    }
    if (typeof action === "function") {
      action(navigate);
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-${size} btn-custom btn-${color} ${className}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
