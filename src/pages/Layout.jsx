import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

export const Layout = () => (
  <ScrollToTop>
    <Navbar />
    <Outlet />
    <Footer />
  </ScrollToTop>
);