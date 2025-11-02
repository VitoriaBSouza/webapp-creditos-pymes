import { useLocation } from "react-router-dom";
import NavbarLoginUser from "./NavbarLoginUser";
import NavbarDashboard from "./NavbarDashboard";
import NavbarHomePage from "./NavbarHomePage";

export default function Navbar() {
  const location = useLocation();

  const loggedUserPaths =
    location.pathname === "/dashboard" ||
    location.pathname === "/partner-dashboard" ||
    location.pathname === "/user/profile" ||
    location.pathname === "/partner/profile" ||
    location.pathname.startsWith("/partner/loan-details/");

  const authPaths = 
    location.pathname === "/login-users" ||
    location.pathname === "/sign-up"

  if (authPaths) {
    return <NavbarLoginUser />;
  } else if (loggedUserPaths) {
    return <NavbarDashboard />;
  } else {
    return <NavbarHomePage />;
  } 
}
