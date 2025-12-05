import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Loader2, AlertCircle, Smartphone } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authService } from "../services/authService";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  // Device session conflict state (for showing info only)
  const [showDeviceConflictAlert, setShowDeviceConflictAlert] = useState(false);
  const [existingSessionData, setExistingSessionData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear alerts when user starts typing
    setShowDeviceConflictAlert(false);
    setExistingSessionData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowVerificationAlert(false);
    setShowDeviceConflictAlert(false); // Reset device conflict alert
    setExistingSessionData(null); // Clear previous session data

    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(formData.email, formData.password);

      if (response.success) {
        toast.success("Login successful! 🎉");

        const user = response.data.user;

        // Small delay to let the toast show, then redirect
        setTimeout(() => {
          if (user.user_role === "admin") {
            // Redirect admin to admin dashboard
            navigate('/admin/dashboard');
          } else if (user.user_role === "student") {
            // Redirect student based on redirect parameter
            if (redirectTo && redirectTo !== '/dashboard') {
              // If there's a specific redirect (like /research-paper), go there
              navigate(redirectTo);
            } else {
              // Otherwise, go to homepage and let user navigate via profile dropdown
              navigate('/');
            }
          } else {
            // Unknown role, redirect to homepage
            navigate('/');
          }
        }, 1000);
      }
    } catch (error) {
      const errorData = error.response?.data;

      if (errorData?.code === "EMAIL_NOT_VERIFIED") {
        setShowVerificationAlert(true);
        setUnverifiedEmail(formData.email);
        toast.error(errorData.message);
      } else if (errorData?.code === "ACTIVE_SESSION_EXISTS") {
        // Device conflict detected - Show alert (no force login option)
        setExistingSessionData(errorData.data);
        setShowDeviceConflictAlert(true);
        toast.error("You are already logged in on another device. Please logout from that device first.");
      } else {
        const errorMessage = errorData?.message || "Login failed. Please check your credentials.";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await authService.resendVerification(unverifiedEmail);
      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to resend verification email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Toaster position="top-center" />

      <div className="bg-gray-800 text-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <div className="bg-green-500 w-10 h-10 flex items-center justify-center rounded-full">
              <span className="text-white font-extrabold text-lg">M</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-green-500">MountGC</h1>
          <p className="text-gray-400 mt-1">Sign in to continue</p>
        </div>

        {showVerificationAlert && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-red-300 text-sm mb-2">
                  Your email is not verified. Please check your inbox.
                </p>
                <button
                  onClick={handleResendVerification}
                  className="text-green-400 text-sm hover:underline font-medium"
                >
                  Resend Verification Email
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeviceConflictAlert && existingSessionData && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Smartphone className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-yellow-300 text-sm font-semibold mb-2">
                  Already Logged In
                </p>
                <p className="text-yellow-200 text-xs mb-3">
                  You are already logged in from another device. Please logout from that device first.
                </p>
                <div className="bg-yellow-900/30 rounded p-2 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-yellow-400">Device:</span>
                    <span className="text-yellow-200 font-medium">
                      {existingSessionData.deviceName || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400">IP:</span>
                    <span className="text-yellow-200 font-medium">
                      {existingSessionData.ipAddress || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400">Login Time:</span>
                    <span className="text-yellow-200 font-medium">
                      {existingSessionData.loginAt 
                        ? new Date(existingSessionData.loginAt).toLocaleString()
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-2 text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-gray-700 text-gray-100 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-700 text-gray-100 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-green-400 text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
