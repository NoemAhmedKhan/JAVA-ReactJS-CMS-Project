import { useNavigate } from "react-router-dom";
import "./__Footer.css";

const __Footer = (props) => {

  const navigate = useNavigate();

  return (
<footer className="footer">
        <span>
          &copy; {props.text} &nbsp;·&nbsp;
        </span>
      </footer>

        );
};

export default __Footer;