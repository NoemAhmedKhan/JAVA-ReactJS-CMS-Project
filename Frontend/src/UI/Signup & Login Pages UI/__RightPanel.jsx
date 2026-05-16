import "./__RightPanel.css";
import __Section from './__Section'

const __RightPanel = (props) => {

  const auth = props.props.auth;
  const icon = props.props.rightPanelSectionIcon;
  const text = props.props.rightPanelSectionText;
  const head = props.props.rightPanelSectionHead;
  const para = props.props.rightPanelSectionPara;
  
  return (
        <__Section auth={auth} icon={icon} text={text} head={head} para={para} />
 )
};

export default __RightPanel;