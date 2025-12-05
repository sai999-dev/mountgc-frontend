import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SubNavbar from "./Components/SubNavbar";
import Services from "./Components/Services";
import BookCounseling from "./Components/BookCounseling";
import ResearchPaper from "./Components/ResearchPaper";
import VisaApplication from "./Components/VisaApplication";
import Footer from "./Components/Footer";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
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
                <Route
                  path="/"
                  element={
                    <div className="text-center py-20 px-4">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Your Gateway To Global Success
                      </h1>
                      <p className="text-2xl text-gray-700 max-w-2xl mx-auto">
                        Join students and professionals on their journey to study, work, and immigrate abroad.
                      </p>
                    </div>
                  }
                />
                <Route path="/services" element={<Services />} />
                <Route path="/book-counseling" element={<BookCounseling />} />
                <Route path="/research-paper" element={<ResearchPaper />} />
                <Route path="/visa-application" element={<VisaApplication />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
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
