import React from "react";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">
        {/* Cancel Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
              <XCircle className="text-red-600" size={48} />
            </div>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {/* Info Box */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">What happened?</h3>
            <p className="text-sm text-gray-600 mb-4">
              You cancelled the payment process or closed the payment window before
              completing the transaction. Your application has been saved and you can
              complete the payment anytime.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Your application is saved. You can complete the
                payment from your dashboard whenever you're ready.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="mr-2" size={18} />
              Try Again
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              <ArrowLeft className="mr-2" size={18} />
              Back to Home
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Having trouble?{" "}
            <a
              href="mailto:mountgc@gmail.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
