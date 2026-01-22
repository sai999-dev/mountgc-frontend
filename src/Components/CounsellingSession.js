import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import api from "../services/api";
import TermsModal from "./TermsModal";
import {
  Star,
  Users,
  Clock,
  Video,
  Calendar,
  CheckCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  FileText,
  Briefcase,
  GraduationCap,
  Target,
  Phone,
  Info,
  Plane,
  X,
  Sparkles,
} from "lucide-react";
import heroImage from "../Assets/counsellingsession.png";

const CounsellingSession = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("USD");
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Data from backend
  const [loading, setLoading] = useState(true);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [pricingConfigs, setPricingConfigs] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);

  // Purchase modal
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    checkAuth();
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  // Fetch pricing data from backend
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await axios.get(
          "https://mountgc-backend.onrender.com/api/counselling/pricing"
        );

        if (response.data.success) {
          const { serviceTypes, counselors, pricingConfigs } = response.data.data;

          setServiceTypes(serviceTypes || []);
          setCounselors(counselors || []);
          setPricingConfigs(pricingConfigs || []);

          // Set defaults
          if (serviceTypes && serviceTypes.length > 0) {
            setSelectedServiceType(serviceTypes[0].service_type_id);
          }
          if (counselors && counselors.length > 0) {
            setSelectedCounselor(counselors[0].counselor_id);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pricing:", error);
        // Use fallback data if API fails
        setServiceTypes([
          { service_type_id: 1, name: "Initial Counseling Session", duration: "1 hour" },
          { service_type_id: 2, name: "Complete Application Help", duration: "2 hours" },
          { service_type_id: 3, name: "Job Application Help", duration: "1.5 hours" },
          { service_type_id: 4, name: "Express Entry/PNP Help", duration: "1 hour" },
        ]);
        setCounselors([
          { counselor_id: 1, name: "Yash Mittra", role: "Senior Counselor" },
          { counselor_id: 2, name: "Priya Sharma", role: "Career Expert" },
        ]);
        setSelectedServiceType(1);
        setSelectedCounselor(1);
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  // Update current price when selections change
  useEffect(() => {
    if (pricingConfigs && pricingConfigs.length > 0 && selectedServiceType) {
      // Find matching pricing config
      let config = pricingConfigs.find(
        (c) =>
          c.service_type_id === selectedServiceType &&
          c.currency === currency &&
          (c.counselor_id === selectedCounselor || c.counselor_id === null)
      );

      // If no counselor-specific pricing, fall back to general pricing for service type
      if (!config) {
        config = pricingConfigs.find(
          (c) =>
            c.service_type_id === selectedServiceType &&
            c.currency === currency &&
            c.counselor_id === null
        );
      }

      // If still no config, try any config for this service/currency
      if (!config) {
        config = pricingConfigs.find(
          (c) =>
            c.service_type_id === selectedServiceType &&
            c.currency === currency
        );
      }

      if (config) {
        setCurrentPrice({
          actual: config.actual_price,
          discounted: config.discounted_price,
          discount_percent: config.discount_percent,
        });
      } else {
        // Fallback pricing
        const fallbackPricing = {
          USD: { actual: 156, discounted: 125, discount_percent: 20 },
          INR: { actual: 12999, discounted: 10499, discount_percent: 19 },
          EUR: { actual: 140, discounted: 112, discount_percent: 20 },
        };
        setCurrentPrice(fallbackPricing[currency] || fallbackPricing.USD);
      }
    } else {
      // Default fallback
      const fallbackPricing = {
        USD: { actual: 156, discounted: 125, discount_percent: 20 },
        INR: { actual: 12999, discounted: 10499, discount_percent: 19 },
        EUR: { actual: 140, discounted: 112, discount_percent: 20 },
      };
      setCurrentPrice(fallbackPricing[currency] || fallbackPricing.USD);
    }
  }, [selectedServiceType, selectedCounselor, currency, pricingConfigs]);

  // Services that charges are adjustable in
  const adjustableServices = [
    {
      icon: FileText,
      title: "Complete Application Help",
      route: "/research-paper",
    },
    {
      icon: Briefcase,
      title: "Job Application Help",
      route: null,
    },
    {
      icon: GraduationCap,
      title: "3 Research Papers (0 Co-authors)",
      route: "/research-paper",
    },
    {
      icon: Plane,
      title: "Express Entry/PNP Help service",
      route: "/visa-application",
    },
  ];

  const targetAudience = [
    {
      icon: Target,
      title: "Students planning to study abroad",
      description: "Get expert guidance on university selection and applications",
    },
    {
      icon: Users,
      title: "Professionals seeking career change",
      description: "Navigate international opportunities with confidence",
    },
    {
      icon: GraduationCap,
      title: "Fresh graduates",
      description: "Start your global journey with the right direction",
    },
    {
      icon: Briefcase,
      title: "Working professionals",
      description: "Balance work and higher education aspirations",
    },
  ];

  const faqs = [
    {
      question: "How does the counselling session work?",
      answer:
        "After booking, you'll receive a confirmation email with a Google Meet link. At the scheduled time, join the video call where our counselor will guide you through your queries, provide personalized advice, and create an action plan for your goals.",
    },
    {
      question: "What should I prepare before the session?",
      answer:
        "Have your academic documents, test scores (if any), resume, and a list of questions ready. The more information you provide, the more personalized guidance you'll receive.",
    },
    {
      question: "Can I reschedule my session?",
      answer:
        "Yes, you can reschedule up to 24 hours before your scheduled session. Contact our support team with your booking ID to reschedule.",
    },
    {
      question: "What if I'm not satisfied with the session?",
      answer:
        "We offer a satisfaction guarantee. If you're not satisfied with the session, contact us within 24 hours and we'll either provide a complimentary follow-up session or process a refund.",
    },
    {
      question: "How long is each session?",
      answer:
        "Each counselling session is 60 minutes long, giving you ample time to discuss your goals, concerns, and get detailed guidance from our experts.",
    },
    {
      question: "Do you provide post-session support?",
      answer:
        "Yes! Depending on your package, you get email support ranging from 7 to 30 days after your session for follow-up questions and clarifications.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Sessions Completed" },
    { value: "4.9", label: "Average Rating", icon: Star },
    { value: "95%", label: "Success Rate" },
    { value: "50+", label: "Countries Covered" },
  ];

  const savings = currentPrice ? currentPrice.actual - currentPrice.discounted : 0;
  const savingsPercent = currentPrice ? Math.round((savings / currentPrice.actual) * 100) : 0;

  const getSelectedServiceName = () => {
    const service = serviceTypes.find((s) => s.service_type_id === selectedServiceType);
    return service ? service.name : "Initial Counseling Session";
  };

  const getSelectedServiceDuration = () => {
    const service = serviceTypes.find((s) => s.service_type_id === selectedServiceType);
    return service ? service.duration : "1 hour";
  };

  const getSelectedCounselorName = () => {
    const counselor = counselors.find((c) => c.counselor_id === selectedCounselor);
    return counselor ? counselor.name : "";
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi, I'm interested in booking a counselling session. Can you help me?"
    );
    window.open(`https://wa.me/917337505390?text=${message}`, "_blank");
  };

  const handleLoginToPay = () => {
    if (!isAuthenticated) {
      navigate("/signin?redirect=/counselling-session");
      return;
    }

    // User is logged in, show purchase modal
    const user = authService.getCurrentUser();
    setPurchaseForm({
      name: user.username || "",
      email: user.email || "",
      phone: "",
      notes: "",
    });
    setShowPurchaseModal(true);
  };

  const handlePurchaseFormChange = (e) => {
    const { name, value } = e.target;
    setPurchaseForm({
      ...purchaseForm,
      [name]: value,
    });
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !authService.isAuthenticated()) {
      toast.error("You must be logged in to purchase. Please login first.");
      setShowPurchaseModal(false);
      navigate("/signin?redirect=/counselling-session");
      return;
    }

    if (!purchaseForm.name || !purchaseForm.email || !purchaseForm.phone) {
      toast.error("Name, email, and phone number are required");
      return;
    }

    // Show terms modal before proceeding to payment
    setShowTermsModal(true);
  };

  const handleTermsAccepted = async () => {
    setPurchaseLoading(true);

    try {
      const purchaseData = {
        service_type_id: selectedServiceType,
        counselor_id: selectedCounselor,
        name: purchaseForm.name,
        email: purchaseForm.email,
        phone: purchaseForm.phone,
        currency: currency,
        actual_amount: currentPrice.actual,
        discount_amount: savings,
        final_amount: currentPrice.discounted,
        duration: getSelectedServiceDuration(),
        notes: purchaseForm.notes || null,
      };

      const response = await api.post("/counselling/purchase", purchaseData);

      if (response.data.success) {
        const purchaseId = response.data.data.purchase_id;

        toast.success("Purchase created! Redirecting to payment...");

        // Create Stripe Checkout Session
        const checkoutResponse = await api.post(
          "/payment/stripe/create-checkout-session/counselling",
          { purchaseId }
        );

        if (checkoutResponse.data.success) {
          window.location.href = checkoutResponse.data.data.sessionUrl;
        } else {
          toast.error("Failed to initiate payment. Please try again.");
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Your session has expired. Please login again.");
        setShowPurchaseModal(false);
        navigate("/signin?redirect=/counselling-session");
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        "Failed to create purchase. Please try again.";
      toast.error(errorMessage);
    } finally {
      setPurchaseLoading(false);
      setShowPurchaseModal(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-green-400 text-sm font-medium">Expert Guidance Available</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Expert Counselling
                <span className="text-green-500"> Session </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Get personalized 1-on-1 guidance from our expert counselors.
                Whether you're planning to study abroad, need visa assistance, or
                seeking career advice - we've got you covered.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={handleLoginToPay}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition flex items-center space-x-2 shadow-lg shadow-green-500/25"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Your Session</span>
                </button>
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition border border-white/20 flex items-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Us</span>
                </button>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">60 Min Sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Expert Counselors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Personalized Advice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Post-Session Support</span>
                </div>
              </div>
            </div>
            {/* Hero Image */}
            <div className="hidden md:block relative">
              <div className="relative">
                <img
                  src={heroImage}
                  alt="Expert Counselling Session"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -inset-4 bg-green-500/20 rounded-3xl blur-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {stat.icon && (
                    <stat.icon className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  )}
                  <span className="text-3xl md:text-4xl font-bold text-green-700">
                    {stat.value}
                  </span>
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - About Service & Start Now */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - About Service */}
            <div className="lg:col-span-2">
              {/* Back button and title */}
              <div className="flex items-center mb-6">
                <button
                  onClick={() => navigate("/services")}
                  className="text-green-600 hover:text-green-700 mr-4"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">About Service</h2>
                  <div className="flex items-center justify-center mt-2">
                    <div className="w-2 h-2 bg-yellow-500 transform rotate-45"></div>
                    <div className="w-24 h-0.5 bg-yellow-500"></div>
                    <div className="w-2 h-2 bg-yellow-500 transform rotate-45"></div>
                  </div>
                </div>
              </div>

              {/* Charges Adjustable In */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Charges Fully Adjustable In
                </h3>
                <div className="space-y-3">
                  {adjustableServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <service.icon className="w-5 h-5 text-yellow-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{service.title}</span>
                      </div>
                      <button
                        onClick={() => service.route && navigate(service.route)}
                        className="px-4 py-2 border-2 border-yellow-500 text-yellow-600 rounded-lg font-medium hover:bg-yellow-50 transition text-sm"
                      >
                        Check Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Start Now Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-4">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 text-center">Start Now</h3>
                </div>
                <div className="p-6 space-y-4">
                  {/* Service Type Dropdown */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Services:</span>
                    <select
                      value={selectedServiceType || ""}
                      onChange={(e) => setSelectedServiceType(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent max-w-[180px] text-sm"
                    >
                      {serviceTypes.map((service) => (
                        <option key={service.service_type_id} value={service.service_type_id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Duration:</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-500">{getSelectedServiceDuration()}</span>
                      <div className="relative group">
                        <Info className="w-4 h-4 text-green-500 cursor-pointer" />
                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="relative">
                            Note: This timeline is just the minimum average time it takes us to deliver the service from our end. Once enrolled, you can use the service anytime within 1 year of your purchase.
                            <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Currency Dropdown */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Currency:</span>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>

                  {/* Session With Dropdown */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Session With:</span>
                    <select
                      value={selectedCounselor || ""}
                      onChange={(e) => setSelectedCounselor(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {counselors.map((counselor) => (
                        <option key={counselor.counselor_id} value={counselor.counselor_id}>
                          {counselor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing */}
                  {currentPrice && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium">Actual Amount:</span>
                        <span className="text-gray-400 line-through">
                          {currency} {currentPrice.actual.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium">Amount:</span>
                        <span className="text-green-600 font-bold text-xl">
                          {currency} {currentPrice.discounted.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">You save:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">
                            {currency} {savings.toLocaleString()}
                          </span>
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {savingsPercent}% off
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Login to Pay / Buy Now Button */}
                  <button
                    onClick={handleLoginToPay}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-full transition mt-6 text-lg"
                  >
                    {isAuthenticated ? "Buy Now" : "Log In To Pay"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Who Is This For?
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our counselling sessions are designed to help individuals at every
            stage of their journey
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetAudience.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Select Options",
                description: "Choose your service, currency and preferred counselor",
                icon: Users,
              },
              {
                step: 2,
                title: "Make Payment",
                description: "Secure payment via Stripe or local payment methods",
                icon: CheckCircle,
              },
              {
                step: 3,
                title: "Schedule Session",
                description: "Pick a date and time that suits you",
                icon: Calendar,
              },
              {
                step: 4,
                title: "Join the Session",
                description: "Get the Google Meet link and join at scheduled time",
                icon: Video,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <item.icon className="w-8 h-8 text-green-600" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Book your personalized counselling session today and get expert
            guidance for your journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleLoginToPay}
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition flex items-center space-x-2 shadow-lg"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Your Session Now</span>
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition flex items-center space-x-2 border-2 border-white"
            >
              <Phone className="w-5 h-5" />
              <span>Talk to Us First</span>
            </button>
          </div>
        </div>
      </section>

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
                    <span className="font-medium text-gray-900">{getSelectedServiceName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Counselor:</span>
                    <span className="font-medium text-gray-900">{getSelectedCounselorName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">{getSelectedServiceDuration()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium text-gray-900">{currency}</span>
                  </div>
                  {currentPrice && (
                    <div className="border-t border-green-300 pt-2 mt-2">
                      <div className="flex justify-between text-base">
                        <span className="text-gray-600">Original Amount:</span>
                        <span className="line-through text-gray-500">
                          {currency} {currentPrice.actual.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-green-600 font-medium">
                          -{currency} {savings.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold mt-2">
                        <span className="text-gray-900">Total Amount:</span>
                        <span className="text-green-600">
                          {currency} {currentPrice.discounted.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
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
                    Notes / Questions (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={purchaseForm.notes}
                    onChange={handlePurchaseFormChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Any specific topics you'd like to discuss in the session..."
                  />
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
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccepted}
        serviceType="counselling"
      />
    </div>
  );
};

export default CounsellingSession;
