import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/research-paper");
    toast.info("You can try purchasing again");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Cancel Icon */}
        <div className="text-center mb-6">
          <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-orange-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">Your payment was not completed</p>
        </div>

        {/* Information */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-800">
            You cancelled the payment process. No charges have been made to your account.
          </p>
        </div>

        {/* Reasons */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Need help?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Check your payment method and try again</li>
            <li>• Contact our support team if you encountered an error</li>
            <li>• Your order details are saved in your account</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go to Dashboard
          </button>
        </div>

        {/* Contact Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need assistance?{" "}
            <a href="mailto:mountgc@gmail.com" className="text-green-600 hover:underline font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
