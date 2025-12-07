import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        const response = await axios.get(
          `https://mountgc-backend.onrender.com/api/auth/verify-email?token=${token}`
        );

        if (response.data.success) {
          setStatus("success");
          setMessage(response.data.message);
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Verification failed. Please try again."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 text-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="text-yellow-400 animate-spin" size={64} />
            </div>
            <h1 className="text-2xl font-bold text-yellow-400 mb-3">
              Verifying Your Email...
            </h1>
            <p className="text-gray-400">Please wait while we verify your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 w-16 h-16 flex items-center justify-center rounded-full">
                <CheckCircle className="text-white" size={40} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-400 mb-3">
              Email Verified! 🎉
            </h1>
            <p className="text-gray-300 mb-6">{message}</p>
            <Link
              to="/signin"
              className="inline-block w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-md transition duration-200"
            >
              Go to Sign In
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 w-16 h-16 flex items-center justify-center rounded-full">
                <XCircle className="text-white" size={40} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-400 mb-3">
              Verification Failed
            </h1>
            <p className="text-gray-300 mb-6">{message}</p>
            <Link
              to="/signup"
              className="inline-block w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-md transition duration-200"
            >
              Back to Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
