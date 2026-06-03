import "./__Section.css";
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

const __Section = (props) => {
  return (
    <section className="auth-right">
      <div className="auth-card">

        <div className="auth-tag">
          <i className={props.rightPanelSectionIcon}></i>
          <span>{props.rightPanelSectionText}</span>
        </div>

        <div className="auth-card-header">
          <h1>{props.rightPanelSectionHead}</h1>
          <p>{props.rightPanelSectionPara}</p>
        </div>

        {props.auth === "signup" ? <SignupForm /> : <LoginForm />}

      </div>
    </section>
  );
};

export default __Section;