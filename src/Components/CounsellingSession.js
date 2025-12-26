import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
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
} from "lucide-react";

const CounsellingSession = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("USD");
  const [selectedCounselor, setSelectedCounselor] = useState("Yash Mittra");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Counselors list (will be managed by admin later)
  const counselors = [
    { id: 1, name: "Yash Mittra", role: "Senior Counselor" },
    { id: 2, name: "Priya Sharma", role: "Career Expert" },
    { id: 3, name: "Rahul Verma", role: "Visa Specialist" },
  ];

  // Pricing based on currency and counselor (will be managed by admin later)
  const pricing = {
    USD: { original: 156.00, discounted: 125.00 },
    INR: { original: 12999, discounted: 10499 },
  };

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

  const currentPricing = pricing[currency];
  const savings = currentPricing.original - currentPricing.discounted;
  const savingsPercent = Math.round((savings / currentPricing.original) * 100);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi, I'm interested in booking a counselling session. Can you help me?"
    );
    window.open(`https://wa.me/917337505390?text=${message}`, "_blank");
  };

  const handleBookSession = () => {
    navigate("/book-counseling", {
      state: {
        selectedCounselor,
        currency,
        price: currentPricing.discounted
      }
    });
  };

  const handleLoginToPay = () => {
    if (!isAuthenticated) {
      // Redirect to signin with redirect parameter
      navigate("/signin?redirect=/counselling-session");
      return;
    }
    // User is logged in, proceed to book session
    handleBookSession();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Premium Service
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.9 (10,000+ reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Expert Counselling Session
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Get personalized 1-on-1 guidance from our expert counselors.
                Whether you're planning to study abroad, need visa assistance, or
                seeking career advice - we've got you covered.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleBookSession}
                  className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition flex items-center space-x-2 shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Your Session</span>
                </button>
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-400 transition flex items-center space-x-2 border-2 border-green-400"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Us</span>
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <Video className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Live Video Session</h3>
                    <p className="text-green-200">Via Google Meet</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-300" />
                    <span>60 Minutes Duration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-green-300" />
                    <span>Flexible Scheduling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span>Personalized Action Plan</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-green-300" />
                    <span>Post-Session Support</span>
                  </div>
                </div>
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
                  {/* Services */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Services:</span>
                    <span className="text-gray-500">Initial Counseling Session</span>
                  </div>

                  {/* Duration */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Duration:</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-500">1 hour (average)</span>
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
                    </select>
                  </div>

                  {/* Session With Dropdown */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Session With:</span>
                    <select
                      value={selectedCounselor}
                      onChange={(e) => setSelectedCounselor(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {counselors.map((counselor) => (
                        <option key={counselor.id} value={counselor.name}>
                          {counselor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Actual Amount:</span>
                      <span className="text-gray-400 line-through">
                        {currency} {currentPricing.original.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Amount:</span>
                      <span className="text-green-600 font-bold text-xl">
                        {currency} {currentPricing.discounted.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">You save:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">
                          {currency} {savings.toFixed(2)}
                        </span>
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {savingsPercent}% off
                        </span>
                      </div>
                    </div>
                  </div>

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
                description: "Choose your currency and preferred counselor",
                icon: Users,
              },
              {
                step: 2,
                title: "Pick a Time Slot",
                description: "Choose from available dates and times that suit you",
                icon: Calendar,
              },
              {
                step: 3,
                title: "Make Payment",
                description: "Secure payment via Stripe or local payment methods",
                icon: CheckCircle,
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
              onClick={handleBookSession}
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
    </div>
  );
};

export default CounsellingSession;
