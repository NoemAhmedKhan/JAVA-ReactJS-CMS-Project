import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Signup from "./UI/Signup & Login Pages UI/Signup";
import Login from "./UI/Signup & Login Pages UI/Login";
import Dashboard from "./UI/Dashboard UI/pages/Dashboard";
import Contacts from "./UI/Dashboard UI/pages/Contacts"
import Profile from "./UI/Dashboard UI/pages/Profile";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contacts" element={<Contacts />} />
      <Route path="/profile"   element={<Profile />} />
    </Routes>
  </BrowserRouter>,
);
