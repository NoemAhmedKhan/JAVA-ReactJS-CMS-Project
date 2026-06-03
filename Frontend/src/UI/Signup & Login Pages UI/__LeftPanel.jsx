import "./__LeftPanel.css";

const __LeftPanel = (props) => {
  return (
    <div className="auth-left">
      <div className="left-content">

        <div className="left-icon-wrap">
          <i className={props.leftPanelIcon}></i>
        </div>

        <h2>{props.leftPanelHead}</h2>
        <p>{props.leftPanelPara}</p>

        <ul className="left-features">
          {props.leftPanelFeatureList.features.map((feature, index) => (
            <li key={index}>
              <i className={props.leftPanelFeatureList.icon}></i>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default __LeftPanel;