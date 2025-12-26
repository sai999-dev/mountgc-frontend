import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authService } from "../services/authService";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[0-9])/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must include at least one uppercase letter, one special character, and one number");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.signup(
        formData.username,
        formData.email,
        formData.password
      );

      if (response.success) {
        toast.success(response.message);
        setShowVerificationMessage(true);
        
        setFormData({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.msg ||
        "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await authService.resendVerification(formData.email);
      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to resend verification email");
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <Toaster position="top-center" />
        <div className="bg-gray-800 text-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 w-16 h-16 flex items-center justify-center rounded-full">
              <Mail className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-green-500 mb-3">
            Check Your Email!
          </h1>
          <p className="text-gray-300 mb-6">
            We've sent a verification link to{" "}
            <span className="text-green-400 font-semibold">{formData.email}</span>
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Please click the verification link in your email to activate your account.
            The link will expire in 24 hours.
          </p>
          <button
            onClick={handleResendVerification}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded-md transition duration-200 mb-3"
          >
            Resend Verification Email
          </button>
          <Link
            to="/signin"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-green-500">Create Account</h1>
          <p className="text-gray-400 mt-1">
            Join MountGC and start your global journey today!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-2 text-gray-300">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="w-full bg-gray-700 text-gray-100 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
            </div>
          </div>

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
            <p className="text-xs text-gray-400 mt-1">
              Minimum 8 characters with at least one uppercase letter, one special character, and one number
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-green-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
