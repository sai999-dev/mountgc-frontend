import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, ArrowRight, FileText, Plane, MessageSquare } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Service type mapping
const SERVICE_INFO = {
  research_paper: {
    name: "Research Paper Drafting & Publishing",
    icon: FileText,
    color: "green",
    delivery: "3-4 weeks"
  },
  visa_application: {
    name: "Visa Application Assistance",
    icon: Plane,
    color: "yellow",
    delivery: "1-2 months"
  },
  counselling_session: {
    name: "Counselling Session",
    icon: MessageSquare,
    color: "purple",
    delivery: "As scheduled"
  }
};

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found");
      setLoading(false);
      return;
    }

    // Verify payment status
    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `https://mountgc-backend.onrender.com/api/payment/stripe/session-status?session_id=${sessionId}`
        );

        if (response.data.success) {
          setPaymentDetails(response.data.data);
          toast.success("Payment successful!");
        } else {
          setError("Payment verification failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError("Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Toaster position="top-right" />
        <div className="text-center">
          <Loader2 className="animate-spin h-16 w-16 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Toaster position="top-right" />
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get service info based on transaction
  const getServiceInfo = () => {
    const serviceType = paymentDetails?.transaction?.service_type;
    return SERVICE_INFO[serviceType] || SERVICE_INFO.research_paper;
  };

  const serviceInfo = paymentDetails ? getServiceInfo() : null;
  const ServiceIcon = serviceInfo?.icon || FileText;

  // Get color classes based on service type
  const getColorClasses = () => {
    const serviceType = paymentDetails?.transaction?.service_type;
    switch (serviceType) {
      case 'visa_application':
        return {
          iconBg: 'bg-yellow-100',
          iconText: 'text-yellow-600',
          bannerBg: 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200',
          serviceBg: 'bg-yellow-500'
        };
      case 'counselling_session':
        return {
          iconBg: 'bg-purple-100',
          iconText: 'text-purple-600',
          bannerBg: 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200',
          serviceBg: 'bg-purple-500'
        };
      default:
        return {
          iconBg: 'bg-green-100',
          iconText: 'text-green-600',
          bannerBg: 'bg-gradient-to-r from-green-50 to-green-100 border-green-200',
          serviceBg: 'bg-green-500'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className={`${colorClasses.iconBg} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <CheckCircle className={colorClasses.iconText} size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your order has been confirmed</p>
        </div>

        {/* Service Info Banner */}
        {paymentDetails && (
          <div className={`${colorClasses.bannerBg} border rounded-xl p-4 mb-6`}>
            <div className="flex items-center space-x-3">
              <div className={`${colorClasses.serviceBg} p-3 rounded-lg`}>
                <ServiceIcon className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{serviceInfo?.name}</h3>
                <p className="text-sm text-gray-600">Service purchased successfully</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Details */}
        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold text-gray-900">{serviceInfo?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-gray-900">
                  {paymentDetails.currency?.toUpperCase()} {paymentDetails.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {paymentDetails.paymentStatus || "Paid"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{paymentDetails.customerEmail}</span>
              </div>
              {paymentDetails.transaction && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm text-gray-900">
                    #{paymentDetails.transaction.transaction_id}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You'll receive a confirmation email shortly</li>
            <li>• Our team will contact you within 24 hours</li>
            <li>• Check your dashboard to track progress</li>
            <li>• Expected delivery: {serviceInfo?.delivery || "As per service"}</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
