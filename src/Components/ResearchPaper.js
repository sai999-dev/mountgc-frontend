import React, { useState, useEffect } from "react";
import { Video, Phone, MessageCircle, CheckCircle, Info, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gifVideo from "../Assets/gif.mp4";
import publishImg1 from "../Assets/publishimg1.png";
import publishImg3 from "../Assets/publishimg3.png";
import publishImg4 from "../Assets/publishimg4.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { authService } from "../services/authService";
import api from "../services/api";
import TermsModal from "./TermsModal";

const ResearchPaper = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("INR");
  const [coAuthors, setCoAuthors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    research_group: false
  });

  const advantages = [
    "Boost your academic profile with published research",
    "Essential for MS/PhD admissions and scholarships",
    "Critical for O-1 and EB-1 visa applications",
    "Peer-reviewed journal publications with your name",
    "Expert guidance from experienced researchers",
    "End-to-end support from drafting to publishing"
  ];

  // Check authentication status on mount and listen for changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    checkAuth();

    // Listen for auth changes
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  // Handle "Log In To Pay" button click
  const handleLoginToPay = () => {
    if (!isAuthenticated) {
      // Redirect to signin with redirect parameter
      navigate("/signin?redirect=/research-paper");
      return;
    }

    // User is logged in, show purchase modal
    const user = authService.getCurrentUser();
    setPurchaseForm({
      name: user.username || "",
      email: user.email || "",
      phone: "",
      notes: "",
      research_group: false
    });
    setShowPurchaseModal(true);
  };

  // Handle purchase form input changes
  const handlePurchaseFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPurchaseForm({
      ...purchaseForm,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle purchase submission (shows terms modal first)
  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();

    // CRITICAL: Check authentication before proceeding
    if (!isAuthenticated || !authService.isAuthenticated()) {
      toast.error("You must be logged in to purchase. Please login first.");
      setShowPurchaseModal(false);
      navigate("/signin?redirect=/research-paper");
      return;
    }

    // Validate form
    if (!purchaseForm.name || !purchaseForm.email || !purchaseForm.phone) {
      toast.error("Name, email, and phone number are required");
      return;
    }

    // Show terms modal before proceeding to payment
    setShowTermsModal(true);
  };

  // Proceed with payment after terms accepted
  const handleTermsAccepted = async () => {
    setPurchaseLoading(true);

    try {
      // Prepare purchase data
      const purchaseData = {
        name: purchaseForm.name,
        email: purchaseForm.email,
        phone: purchaseForm.phone || null,
        currency: currency,
        co_authors: parseInt(coAuthors),
        actual_amount: currentPrice.actual,
        discount_amount: currentPrice.saved,
        final_amount: currentPrice.discounted,
        duration: currentPrice.duration,
        research_group: purchaseForm.research_group,
        notes: purchaseForm.notes || null
      };

      // Step 1: Create purchase record
      const purchaseResponse = await api.post("/student/research-papers/purchase", purchaseData);

      if (purchaseResponse.data.success) {
        const purchaseId = purchaseResponse.data.data.purchase_id;

        toast.success("Purchase order created! Redirecting to payment...");

        // Step 2: Create Stripe Checkout Session
        const checkoutResponse = await api.post("/payment/stripe/create-checkout-session/research-paper", {
          purchaseId: purchaseId
        });

        if (checkoutResponse.data.success) {
          const { sessionUrl } = checkoutResponse.data.data;

          // Redirect to Stripe Checkout
          window.location.href = sessionUrl;
        } else {
          toast.error("Failed to initiate payment. Please try again.");
          setPurchaseLoading(false);
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);

      // Handle authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Your session has expired. Please login again.");
        setShowPurchaseModal(false);
        setPurchaseLoading(false);
        navigate("/signin?redirect=/research-paper");
        return;
      }

      const errorMessage = error.response?.data?.message || "Failed to create purchase order. Please try again.";
      toast.error(errorMessage);
    } finally {
      setPurchaseLoading(false);
      setShowPurchaseModal(false);
    }
  };

  // Fetch pricing configurations from backend
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await axios.get("https://mountgc-backend.onrender.com/api/student/research-papers/pricing");
        if (response.data.success) {
          const data = response.data.data;
          setPricingData(data);

          // Set default currency if available currencies exist
          const availableCurrencies = Object.keys(data);
          if (availableCurrencies.length > 0) {
            // Check if current currency exists, otherwise use first available
            if (!availableCurrencies.includes(currency)) {
              setCurrency(availableCurrencies[0]);
            }
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching pricing:", error);
        toast.error("Failed to load pricing information");
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  // Update current price when currency or co-authors changes
  useEffect(() => {
    if (pricingData && pricingData[currency]) {
      // If co-authors value doesn't exist for current currency, set to first available
      const availableCoAuthors = pricingData[currency].map(c => c.co_authors);
      if (!availableCoAuthors.includes(parseInt(coAuthors))) {
        setCoAuthors(availableCoAuthors[0]);
        return;
      }

      const config = pricingData[currency].find(
        (item) => item.co_authors === parseInt(coAuthors)
      );

      if (config) {
        setCurrentPrice({
          actual: config.actual_price,
          discounted: config.discounted_price,
          saved: config.actual_price - config.discounted_price,
          duration: config.duration_weeks,
          discount_percent: config.discount_percent
        });
      } else {
        // Fallback if no config found
        setCurrentPrice({
          actual: 0,
          discounted: 0,
          saved: 0,
          duration: "3-4 weeks",
          discount_percent: 20
        });
      }
    }
  }, [currency, coAuthors, pricingData]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  // If no pricing data available
  if (!currentPrice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Pricing information not available. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        
        {/* TOP SECTION: TEXT LEFT + VIDEO RIGHT */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
          {/* LEFT SIDE CONTENT */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 leading-snug">
              RESEARCH PAPER DRAFTING & PUBLISHING HELP
            </h1>

            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Publishing credible research papers with your name on them can help boost your profile!
              Extremely crucial for MS/PhD and O-1/EB-1 visa applicants.
            </p>

            <p className="text-lg font-semibold mb-2">Includes:</p>

            <div className="flex items-center gap-8 mb-8 flex-wrap">
              <div className="flex flex-col items-center">
                <Video size={40} className="text-green-500 mb-2" />
                <p className="text-sm text-gray-700">Video call</p>
              </div>

              <div className="flex flex-col items-center">
                <Phone size={40} className="text-green-500 mb-2" />
                <p className="text-sm text-gray-700">Audio call</p>
              </div>

              <div className="flex flex-col items-center">
                <MessageCircle size={40} className="text-green-500 mb-2" />
                <p className="text-sm text-gray-700">Text Support</p>
              </div>
            </div>

            {/* WhatsApp Session Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-green-500 rounded-lg p-4 shadow-sm">
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded transition w-full sm:w-auto">
                Free 5 Minute WhatsApp Session
              </button>
              <p className="text-gray-600 text-sm text-center sm:text-left">
                Have questions about this service? Let's chat.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE VIDEO */}
          <div className="flex justify-center">
            <video
              src={gifVideo}
              autoPlay
              loop
              muted
              playsInline
              className="rounded-xl shadow-md w-full max-w-md h-auto object-cover"
            />
          </div>
        </div>

        {/* BOTTOM SECTION: ADVANTAGES LEFT + START NOW BOX RIGHT */}
        <div className="grid md:grid-cols-[1fr,400px] gap-8 items-start">
          
          {/* LEFT SIDE - ADVANTAGES */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
              Advantages of Research Papers
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Unlock a world of opportunities
            </p>

            {/* 2 Column, 3 Row Grid for Advantages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {advantages.map((advantage, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                  <p className="text-gray-800 text-sm md:text-base">{advantage}</p>
                </div>
              ))}
            </div>

            {/* High-Impact Research Publications Box */}
            <div className= " bg-white border-2 border-green-200 rounded-xl p-6 mt-6">
              <h3 className="text-xl md:text-2xl font-bold text-green-600 text-center mb-3">
                High-Impact Research Publications
              </h3>
              <p className="text-gray-700 text-center mb-6">
                The research work under this program is highly valuable and is guaranteed to be published in{" "}
                <span className="font-semibold">IEEE, Springer, Elsevier, or Taylor & Francis</span>
              </p>

              {/* Publisher Images */}
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                <img
                  src={publishImg1}
                  alt="IEEE Publisher"
                  className="h-12 md:h-16 object-contain opacity-90 hover:opacity-100 transition"
                />
                <img
                  src={publishImg3}
                  alt="Springer Publisher"
                  className="h-12 md:h-16 object-contain opacity-90 hover:opacity-100 transition"
                />
                <img
                  src={publishImg4}
                  alt="Elsevier Publisher"
                  className="h-12 md:h-16 object-contain opacity-90 hover:opacity-100 transition"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - START NOW BOX */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Start Now</h2>

            {/* Service */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-800">Services:</label>
              <p className="text-gray-700">Research Paper Drafting & Publishing Help</p>
            </div>

            {/* Duration */}
            <div className="mb-4 flex items-center gap-2">
              <label className="block font-semibold text-gray-800">Duration:</label>
              <span className="text-gray-700">{currentPrice.duration}</span>
              <Info size={16} className="text-gray-400" />
            </div>

            {/* Currency Dropdown */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-800">Currency:</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {pricingData && Object.keys(pricingData).map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>

            {/* Co-Authors Dropdown */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-800">Co-Authors:</label>
              <select
                value={coAuthors}
                onChange={(e) => setCoAuthors(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {pricingData && pricingData[currency] &&
                  pricingData[currency].map((config) => (
                    <option key={config.co_authors} value={config.co_authors}>
                      {config.co_authors}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Actual Amount */}
            <div className="mb-2">
              <label className="block font-semibold text-gray-800">Actual Amount:</label>
              <p className="text-gray-500 line-through">
                {currency} {currentPrice.actual.toLocaleString()}
              </p>
            </div>

            {/* Discounted Amount */}
            <div className="mb-4">
              <label className="block font-semibold text-gray-800">Amount:</label>
              <p className="text-2xl font-bold text-red-600">
                {currency} {currentPrice.discounted.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">/author</p>
            </div>

            {/* You Save */}
            <div className="mb-4 flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg p-3">
              <span className="font-semibold text-gray-800">You save:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{currency} {currentPrice.saved.toLocaleString()}</span>
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {currentPrice.discount_percent}% off
                </span>
              </div>
            </div>

            {/* Research Group Link */}
            <p className="text-center text-sm text-blue-600 hover:underline cursor-pointer mb-4">
              Do you want to join or create a research group?
            </p>

            {/* Log In To Pay Button */}
            <button
              onClick={handleLoginToPay}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-xl"
            >
              {isAuthenticated ? "Proceed to Purchase" : "Log In To Pay"}
            </button>
          </div>

        </div>

      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {/* Purchase Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium text-gray-900">Research Paper Drafting & Publishing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium text-gray-900">{currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Co-Authors:</span>
                    <span className="font-medium text-gray-900">{coAuthors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">{currentPrice.duration}</span>
                  </div>
                  <div className="border-t border-green-300 pt-2 mt-2">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Original Amount:</span>
                      <span className="line-through text-gray-500">{currency} {currentPrice.actual.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-green-600 font-medium">-{currency} {currentPrice.saved.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-2">
                      <span className="text-gray-900">Total Amount:</span>
                      <span className="text-green-600">{currency} {currentPrice.discounted.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Form */}
              <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={purchaseForm.name}
                    onChange={handlePurchaseFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={purchaseForm.email}
                    onChange={handlePurchaseFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={purchaseForm.phone}
                    onChange={handlePurchaseFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={purchaseForm.notes}
                    onChange={handlePurchaseFormChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Any specific requirements or questions..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="research_group"
                    id="research_group"
                    checked={purchaseForm.research_group}
                    onChange={handlePurchaseFormChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="research_group" className="ml-2 text-sm text-gray-700">
                    I want to join or create a research group
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
                    disabled={purchaseLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={purchaseLoading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchaseLoading ? "Processing..." : "Confirm Purchase"}
                  </button>
                </div>
              </form>

              {/* Info Note */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After confirming your purchase, our team will contact you via email/phone to complete the payment process and begin your research paper journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccepted}
        serviceType="research_paper"
      />
    </div>
  );
};

export default ResearchPaper;
