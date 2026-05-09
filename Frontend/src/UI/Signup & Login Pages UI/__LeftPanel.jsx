import "./__LeftPanel.css";

const __LeftPanel = (props) => {
  return (
    <div className="auth-left">
      <div className="left-content">

        <div className="left-icon-wrap">
          <i className={props.props.leftPanelIcon}></i>
        </div>

        <h2>{props.props.leftPanelHead}</h2>

        <p>{props.props.leftPanelPara}</p>

        <ul className="left-features">

          {props.props.leftPanelFeatureList.features.map((feature, index) => (
            <li key={index}>
              <i className={props.props.leftPanelFeatureList.icon}></i>
              <span>{feature}</span>
            </li>
          ))}

        </ul>

      </div>
    </div>
  );
};

export default __LeftPanel;