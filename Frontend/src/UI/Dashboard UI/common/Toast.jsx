import "./Toast.css";

const ICONS = {
  success: "fas fa-check-circle",
  error: "fas fa-times-circle",
  info: "fas fa-info-circle",
};

const Toast = ({ message, type = "success" }) => {
  return (
    <div className={`toast toast--${type}`}>
      <i className={ICONS[type] || ICONS.success} />
      <span>{message}</span>
    </div>
  );
};

export default Toast;
