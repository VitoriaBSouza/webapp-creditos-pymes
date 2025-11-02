import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "../pages/Layout";
import HomePage from "../pages/HomePage";
import LoginUsers from "../pages/LoginUsers";
import DashboardPage from "../pages/DashboardPage";
import { LoginPartners } from "../pages/LoginPartners";
import { PartnerDashboardPage } from "../pages/PartnerDashboardPage";
import { ClientProfilePage } from "../pages/ClientProfilePage";
import { PartnerProfilePage } from "../pages/PartnerProfilePage";
import { LoanDetailsPage } from "../pages/LoanDetailsPage";
import SignInPage from "../pages/SignIn";
import { ProtectedRoute } from "../auth/RouteProtection";
import ResetPasswd from "../pages/ResetPasswd";
import ForgotPassword from "../pages/ForgotPasswd";

export const AppRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not Found</h1>}>
      <Route index element={<HomePage />} />
      <Route path="sign-up" element={<SignInPage />} />
      <Route path="login-users" element={<LoginUsers />} />
      <Route path="login-partners" element={<LoginPartners />} />
      <Route path="reset-password" element={<ResetPasswd />} />
      <Route path="forgot-password" element={<ForgotPassword />} />

      {/* Rutas para solicitantes */}
      <Route element={<ProtectedRoute allowedRole="applicant" />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="user/profile" element={<ClientProfilePage />} />
      </Route>

      {/* Rutas para operadores */}
      <Route element={<ProtectedRoute allowedRole="operator" />}>
        <Route path="partner-dashboard" element={<PartnerDashboardPage />} />
        <Route path="partner/profile" element={<PartnerProfilePage />} />
        <Route path="partner/loan-details/:loan_id" element={<LoanDetailsPage />} />
      </Route>
    </Route>
  ),
  { future: { v7_startTransition: true } }
);