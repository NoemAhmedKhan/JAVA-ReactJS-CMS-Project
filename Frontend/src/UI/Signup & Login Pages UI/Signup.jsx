import __Header from "./__Header";
import __Main from "./__Main";
import __Footer from "./__Footer";

const Signup = () => {
  return (
    <>

<__Header auth="Sign Up"/>
<__Main 
auth="Signup"
leftPanelIcon="fas fa-users" 
leftPanelHead="Start for free." 
leftPanelPara="Join ContactHub to manage your contacts in smarter way."
leftPanelFeatureList={
{
  icon: "fas fa-check-circle",
  features: ["Save profiles digitally", "Organize contact into groups", "Search any contact instantly", "Safe and secure your contacts", "Easily import / export your contacts", "Scalable for mobile, tablet, desktop"]
}
}

rightPanelSectionIcon="fas fa-user-plus"
rightPanelSectionText="Create Account"
rightPanelSectionHead="Create your free account"
rightPanelSectionPara="Join ContactHub to manage your contacts in smarter way."
/>

<__Footer text="2026 ContactHub | All rights are reserved by Noem Ahmed Khan"/>
    </>
  );
};

export default Signup;
