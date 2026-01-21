import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://mountgc-backend.onrender.com/api/auth/forgot-password",
        { email }
      );

      if (response.data.success) {
        setEmailSent(true);
        toast.success("Password reset link sent to your email!");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      // Even on error, show generic message for security
      setEmailSent(true);
      toast.success("If an account exists, you will receive a password reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-12">
      <Toaster position="top-right" />

      <div className="w-full max-w-md">
        {/* Back to Login Link */}
        <Link
          to="/signin"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!emailSent ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600">
                  No worries! Enter your registered email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h1>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your inbox and click the link to reset your password.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  The link will expire in 1 hour. If you don't see the email, check your spam folder.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition"
                  >
                    Try Different Email
                  </button>
                  <Link
                    to="/signin"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition text-center"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link to="/signin" className="text-green-600 hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
