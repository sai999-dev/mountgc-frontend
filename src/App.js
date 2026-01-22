import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop";
import Navbar from "./Components/Navbar";
import SubNavbar from "./Components/SubNavbar";
import Services from "./Components/Services";
import BookCounseling from "./Components/BookCounseling";
import CounsellingSession from "./Components/CounsellingSession";
import ResearchPaper from "./Components/ResearchPaper";
import VisaApplication from "./Components/VisaApplication";
import Footer from "./Components/Footer";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import LandingPage from "./Components/LandingPage";
import FloatingwhatsAppButton from "./Components/FloatingWhatsAppButton";

import "./App.css";
import VerifyEmail from "./pages/VerifyEmail";
import StudentDashboard from "./Components/Student/StudentDashboard";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import PaymentSuccess from "./Components/PaymentSuccess";
import PaymentCancel from "./Components/PaymentCancel";

function App() {
return (
  <Router>
    {/* ✅ Scroll to top on route change */}
    <ScrollToTop />

    {/* ✅ Floating button placed here - visible on ALL pages */}
    <FloatingwhatsAppButton
phoneNumber="917337505390"
      message="Hi, I'm interested in your services!"
      position="bottom-right"
    />

    <Routes>
      {/* ✅ Dashboard Routes (No Navbar/Footer) */}
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* ✅ Public Routes (With Navbar/Footer) */}
      <Route
        path="/*"
        element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <SubNavbar />

            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/services" element={<Services />} />
                <Route path="/counselling-session" element={<CounsellingSession />} />
                <Route path="/book-counseling" element={<BookCounseling />} />
                <Route path="/research-paper" element={<ResearchPaper />} />
                <Route path="/visa-application" element={<VisaApplication />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail/>} />

                {/* Payment pages */}
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
              </Routes>
            </div>

            <Footer />
          </div>
        }
      />
    </Routes>
  </Router>
);
}

export default App;
