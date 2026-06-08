import "./StatsCard.css";

const StatsCard = ({ icon, label, value, color = "primary" }) => {
  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className="stats-card-icon">
        <i className={icon} />
      </div>
      <div className="stats-card-body">
        <span className="stats-card-value">{value}</span>
        <span className="stats-card-label">{label}</span>
      </div>
    </div>
  );
};

export default StatsCard;
