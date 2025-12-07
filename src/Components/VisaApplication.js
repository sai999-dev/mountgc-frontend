import React, { useState, useEffect, useMemo } from "react";
import { Info, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VisaApplication = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("USA");

  // Pricing state
  const [currency, setCurrency] = useState("INR");
  const [dependents, setDependents] = useState(0);
  const [mocks, setMocks] = useState(1);
  const [pricingConfigs, setPricingConfigs] = useState([]);
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const countries = [
    { name: "USA", flag: "https://flagcdn.com/us.svg" },
    { name: "Canada", flag: "https://flagcdn.com/ca.svg" },
    { name: "UK", flag: "https://flagcdn.com/gb.svg" },
  ];

  // Get available currencies
  const availableCurrencies = useMemo(() => {
    if (!pricingConfigs.length) return [];
    return [...new Set(pricingConfigs.map(c => c.currency))].sort();
  }, [pricingConfigs]);

  // Get dependents and mocks based on selected currency
  const availableOptions = useMemo(() => {
    if (!pricingConfigs.length || !currency) {
      return { dependents: [], mocks: [] };
    }

    // Filter configs by selected currency
    const currencyConfigs = pricingConfigs.filter(c => c.currency === currency);

    const dependents = [...new Set(currencyConfigs.map(c => c.dependents))].sort((a, b) => a - b);
    const mocks = [...new Set(currencyConfigs.map(c => c.mocks))].sort((a, b) => a - b);

    return { dependents, mocks };
  }, [pricingConfigs, currency]);

  // Check authentication (optional - allow viewing but require login for submission)
  // Removed automatic redirect to allow users to view pricing without login

  // Fetch pricing configs on mount
  useEffect(() => {
    fetchPricingConfigs();
  }, []);

  // Set initial currency when configs are loaded
  useEffect(() => {
    if (availableCurrencies.length > 0 && !availableCurrencies.includes(currency)) {
      setCurrency(availableCurrencies[0]);
    }
  }, [availableCurrencies, currency]);

  // Reset dependents and mocks when currency changes or available options change
  useEffect(() => {
    if (availableOptions.dependents.length > 0) {
      if (!availableOptions.dependents.includes(dependents)) {
        setDependents(availableOptions.dependents[0]);
      }
    }
    if (availableOptions.mocks.length > 0) {
      if (!availableOptions.mocks.includes(mocks)) {
        setMocks(availableOptions.mocks[0]);
      }
    }
  }, [availableOptions, dependents, mocks]);

  // Calculate price when currency, dependents, or mocks change
  useEffect(() => {
    if (pricingConfigs.length > 0) {
      calculatePrice();
    }
  }, [currency, dependents, mocks, pricingConfigs]);

  const fetchPricingConfigs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://mountgc-backend.onrender.com/api/student/visa-applications/pricing",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setPricingConfigs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pricing configs:", error);
      toast.error("Failed to load pricing information");
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = async () => {
    try {
      setCalculating(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "https://mountgc-backend.onrender.com/api/student/visa-applications/calculate",
        {
          currency,
          dependents: parseInt(dependents),
          mocks: parseInt(mocks),
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setCalculatedPrice(response.data.data);
    } catch (error) {
      console.error("Error calculating price:", error);
      toast.error(
        error.response?.data?.message || "Failed to calculate price"
      );
      setCalculatedPrice(null);
    } finally {
      setCalculating(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!calculatedPrice) {
      toast.error("Please select valid pricing options");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessToken");

      const purchaseData = {
        country: selectedCountry,
        currency,
        dependents: parseInt(dependents),
        mocks: parseInt(mocks),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        notes: formData.notes || null,
      };

      // Step 1: Create purchase record
      const purchaseResponse = await axios.post(
        "https://mountgc-backend.onrender.com/api/student/visa-applications/purchase",
        purchaseData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const purchase = purchaseResponse.data.data;

      toast.success("Application created! Redirecting to payment...");

      // Step 2: Create Stripe checkout session
      const checkoutResponse = await axios.post(
        "https://mountgc-backend.onrender.com/api/student/visa-applications/create-checkout-session",
        {
          purchaseId: purchase.purchase_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { sessionUrl } = checkoutResponse.data.data;

      // Step 3: Redirect to Stripe checkout
      window.location.href = sessionUrl;

    } catch (error) {
      console.error("Error submitting visa application:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit visa application. Please try again."
      );
      setSubmitting(false);
    }
  };

  const handleProceedToPay = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/signin");
      return;
    }

    if (!calculatedPrice) {
      toast.error("Please wait while we calculate the price");
      return;
    }

    setShowForm(true);
  };

  // Currency symbol helper
  const getCurrencySymbol = (curr) => {
    const symbols = { INR: "₹", USD: "$", EUR: "€" };
    return symbols[curr] || curr;
  };

  return (
    <div className="bg-gradient-to-b from-yellow-50 to-white min-h-screen px-4 md:px-16 py-10">
      {/* Header */}
      <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
        About Service
      </h1>
      <div className="w-24 h-1 bg-yellow-400 mx-auto mb-10 rounded"></div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div>
          {/* Country Tabs */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
            {countries.map((country) => (
              <button
                key={country.name}
                onClick={() => setSelectedCountry(country.name)}
                className={`flex items-center gap-2 border rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  selectedCountry === country.name
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                <img
                  src={country.flag}
                  alt={country.name}
                  className="w-5 h-5 object-cover"
                />
                {country.name}
              </button>
            ))}
          </div>

          {/* Visa Types */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <p className="font-semibold mb-4 text-gray-800">
              This service is valid for the following visa types:
            </p>

            {/* Visa Categories */}
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-2">Student Visas:</p>
                <div className="flex flex-wrap gap-2">
                  {["F-1", "F-2", "J-1", "J-2", "M-1", "M-2"].map((visa) => (
                    <span
                      key={visa}
                      className="border border-yellow-400 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full"
                    >
                      {visa}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-2">Work Visas:</p>
                <div className="flex flex-wrap gap-2">
                  {["H-4", "H-1B", "L-1A", "L-2"].map((visa) => (
                    <span
                      key={visa}
                      className="border border-yellow-400 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full"
                    >
                      {visa}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-2">
                  Business & Tourism:
                </p>
                <div className="flex flex-wrap gap-2">
                  {["B1", "B2"].map((visa) => (
                    <span
                      key={visa}
                      className="border border-yellow-400 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full"
                    >
                      {visa}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-2">Others:</p>
                <div className="flex flex-wrap gap-2">
                  {["K", "U", "O", "C1-D"].map((visa) => (
                    <span
                      key={visa}
                      className="border border-yellow-400 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full"
                    >
                      {visa}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Appointments Section */}
          <div className="mt-8 bg-gray-900 text-white rounded-lg border-2 border-yellow-400 p-5 relative shadow-md">
            <div className="absolute -top-6 left-5 bg-white border border-yellow-400 w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-yellow-500 text-xl">⏱</span>
            </div>
            <div className="mt-6">
              <h2 className="font-semibold mb-2 text-lg">Quick Appointments</h2>
              <p className="text-gray-200 text-sm leading-relaxed">
                Leverage the best-in-class 24/7 visa monitoring and faster
                appointment booking without any effort needed on your end.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - PRICING CARD */}
        <div>
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 sticky top-20">
            <h2 className="text-xl font-semibold text-center mb-4">
              Start Now
            </h2>

            <div className="space-y-3 text-gray-700 text-sm">
              <p>
                <strong>Services:</strong> Visa Application Help
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {calculatedPrice?.duration || "1–2 months"}{" "}
                <Info className="inline text-gray-500" size={14} />
              </p>

              <div>
                <p className="font-medium">Currency:</p>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1"
                  disabled={loading || showForm || availableCurrencies.length === 0}
                >
                  {availableCurrencies.length > 0 ? (
                    availableCurrencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))
                  ) : (
                    <option>Loading...</option>
                  )}
                </select>
              </div>

              <div>
                <p className="font-medium">Dependents:</p>
                <select
                  value={dependents}
                  onChange={(e) => setDependents(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1"
                  disabled={loading || showForm || availableOptions.dependents.length === 0}
                >
                  {availableOptions.dependents.length > 0 ? (
                    availableOptions.dependents.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))
                  ) : (
                    <option>Loading...</option>
                  )}
                </select>
              </div>

              <div>
                <p className="font-medium">Mocks:</p>
                <select
                  value={mocks}
                  onChange={(e) => setMocks(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1"
                  disabled={loading || showForm || availableOptions.mocks.length === 0}
                >
                  {availableOptions.mocks.length > 0 ? (
                    availableOptions.mocks.map((mock) => (
                      <option key={mock} value={mock}>
                        {mock}
                      </option>
                    ))
                  ) : (
                    <option>Loading...</option>
                  )}
                </select>
              </div>

              {/* Visa Guarantee */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-md p-2 text-center font-semibold text-sm mt-3">
                <Sparkles className="inline mr-2 text-gray-800" size={14} />
                Visa Guarantee Included
              </div>

              {/* Amounts */}
              <div className="mt-5 text-sm">
                {calculating ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                    <span className="ml-2 text-gray-500">Calculating...</span>
                  </div>
                ) : calculatedPrice ? (
                  <>
                    <p className="text-gray-400 line-through">
                      Actual Amount: {getCurrencySymbol(currency)}
                      {calculatedPrice.actual_amount.toFixed(2)}
                    </p>
                    <p className="text-red-600 font-bold text-lg">
                      Amount: {getCurrencySymbol(currency)}
                      {calculatedPrice.discounted_amount.toFixed(2)}
                    </p>
                    <p className="text-green-600 font-medium">
                      You Save: {getCurrencySymbol(currency)}
                      {calculatedPrice.discount_amount.toFixed(2)}{" "}
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded ml-1">
                        {calculatedPrice.discount_percent.toFixed(0)}% off
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No pricing available for this combination
                  </p>
                )}
              </div>

              {/* Payment Button or Form */}
              {!showForm ? (
                <button
                  onClick={handleProceedToPay}
                  disabled={loading || calculating || !calculatedPrice}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg mt-4 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading || calculating ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Loading...
                    </>
                  ) : (
                    "Proceed to Apply"
                  )}
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      rows={3}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm resize-none"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2.5 rounded-lg transition disabled:bg-gray-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition disabled:bg-gray-400 flex items-center justify-center"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={18} />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaApplication;
