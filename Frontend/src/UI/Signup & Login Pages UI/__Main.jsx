import "./__Main.css";
import __LeftPanel from "./__LeftPanel";
import __RightPanel from "./__RightPanel";

const __Main = (props) => {
  return (
    <div className="auth-main">
      <__LeftPanel {...props} />
      <__RightPanel {...props} />
    </div>
  );
};

export default __Main;