import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/payment/stripe/session-status?session_id=${sessionId}`
      );

      if (response.data.success) {
        setPaymentData(response.data.data);
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      setError(err.response?.data?.message || "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-green-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
              <CheckCircle className="text-green-600" size={48} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>

          {/* Payment Details */}
          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">
                    {paymentData.paymentStatus || "Paid"}
                  </span>
                </div>
                {paymentData.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-900">
                      {paymentData.currency?.toUpperCase()} {paymentData.amount.toFixed(2)}
                    </span>
                  </div>
                )}
                {paymentData.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">
                      {paymentData.customerEmail}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                ⚠️ {error}
              </p>
              <p className="text-yellow-700 text-xs mt-2">
                Your payment was successful, but we couldn't verify all details.
                Please check your email for confirmation.
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>You'll receive a confirmation email shortly with all the details</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">👨‍💼</span>
                <span>Our team will contact you within 24 hours to discuss next steps</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📊</span>
                <span>You can track your application status in your dashboard</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Go to Dashboard
              <ArrowRight className="ml-2" size={18} />
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Need help?{" "}
            <a
              href="mailto:mountgc@gmail.com"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
