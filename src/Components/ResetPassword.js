import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle, XCircle, Check, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  // Password validation states
  const [validations, setValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false,
    passwordsMatch: false,
  });

  // Check if token exists on mount
  useEffect(() => {
    if (!token) {
      setTokenError(true);
    }
  }, [token]);

  // Validate password as user types
  useEffect(() => {
    setValidations({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      passwordsMatch: password === confirmPassword && password.length > 0,
    });
  }, [password, confirmPassword]);

  const isPasswordValid = () => {
    return (
      validations.minLength &&
      validations.hasUppercase &&
      validations.hasNumber &&
      validations.hasSpecial &&
      validations.passwordsMatch
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid()) {
      toast.error("Please meet all password requirements");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://mountgc-backend.onrender.com/api/auth/reset-password",
        { token, password }
      );

      if (response.data.success) {
        setResetSuccess(true);
        toast.success("Password reset successful!");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
      toast.error(errorMessage);

      // If token is invalid or expired, show token error
      if (errorMessage.includes("expired") || errorMessage.includes("Invalid")) {
        setTokenError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Validation item component
  const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center space-x-2 text-sm ${isValid ? "text-green-600" : "text-gray-500"}`}>
      {isValid ? (
        <Check className="w-4 h-4" />
      ) : (
        <X className="w-4 h-4" />
      )}
      <span>{text}</span>
    </div>
  );

  // Token error state
  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-12">
        <Toaster position="top-right" />
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid or Expired Link
            </h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new password reset link.
            </p>
            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition text-center"
              >
                Request New Link
              </Link>
              <Link
                to="/signin"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-12">
        <Toaster position="top-right" />
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <Link
              to="/signin"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition text-center"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-600">
              Enter your new password below. Make sure it's strong and secure.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Enter new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Confirm new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
              <ValidationItem isValid={validations.minLength} text="At least 8 characters" />
              <ValidationItem isValid={validations.hasUppercase} text="At least one uppercase letter" />
              <ValidationItem isValid={validations.hasNumber} text="At least one number" />
              <ValidationItem isValid={validations.hasSpecial} text="At least one special character (!@#$%^&*)" />
              <ValidationItem isValid={validations.passwordsMatch} text="Passwords match" />
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid()}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

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

export default ResetPassword;
