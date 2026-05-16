import "./__Section.css";
import SignupForm from './SignupForm'
import LoginForm from "./LoginForm";

const __Section = (props) => {
  return (
        <section className="auth-right">
          <div className="auth-card">
            <div className="auth-tag">
              <i className={props.icon}></i>
              <span>{props.text}</span>
            </div>

            <div className="auth-card-header">
              <h1>{props.head}</h1>
              <p>{props.para}</p>
            </div>

        {props.auth === "signup"? <SignupForm />: <LoginForm />}
        </div>
</section>
              );
};

export default __Section;