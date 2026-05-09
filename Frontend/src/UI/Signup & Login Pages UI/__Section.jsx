import "./__Section.css";
import __SignupForm from './__SignupForm'
import __LoginForm from "./__LoginForm";

const __Section = (props) => {
  return (
        <section className="auth-right">
          <div className="auth-card">
            <div className="auth-tag">
              <i className={props.props.rightPanelIcon}></i>
              <span>{props.props.rightPanelText}</span>
            </div>

            <div className="auth-card-header">
              <h1>{props.props.rightPanelHead}</h1>
              <p>{props.props.rightPanelPara}</p>
            </div>
        </div>

        (props.props.auth === "Signup")? <__SignupForm />: <__LoginForm />
</section>
              );
};

export default __Section;