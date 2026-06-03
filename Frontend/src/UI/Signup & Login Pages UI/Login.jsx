import __Header from "./__Header";
import __Main from "./__Main"
import __Footer from "./__Footer"

const Login = () => {
  
  return (
    <>
    <__Header auth="Login"/>
    <__Main 
auth="login"
leftPanelIcon="fas fa-address-card" 
leftPanelHead="Welcome back!" 
leftPanelPara="Log in to access your contacts, manage your network, and stay organized."
leftPanelFeatureList={
{
  icon: "fas fa-check-circle",
  features: ["Save profiles digitally", "Organize contact into groups", "Search any contact instantly", "Safe and secure your contacts", "Easily import / export your contacts", "Scalable for mobile, tablet, desktop"]
}
}

rightPanelSectionIcon="fas fa-lock"
rightPanelSectionText="Secure Login"
rightPanelSectionHead="Sign in to your account"
rightPanelSectionPara="Enter your credentials to access your dashboard."
/>

<__Footer text="2026 ContactHub | All rights are reserved by Noem Ahmed Khan"/>

    </>
  );
}

export default Login;
