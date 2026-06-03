import "./__Footer.css";

const __Footer = (props) => {

  return (
<footer className="footer">
        <span>
          &copy; {props.text} &nbsp;·&nbsp;
        </span>
      </footer>

        );
};

export default __Footer;