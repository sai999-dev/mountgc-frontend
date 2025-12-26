import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Award,
  Briefcase,
  GraduationCap,
  Target,
  ArrowRight,
  Phone,
} from "lucide-react";

const CounsellingSession = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("INR");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const currencyOptions = [
    { code: "INR", symbol: "₹", flag: "🇮🇳" },
    { code: "USD", symbol: "$", flag: "🇺🇸" },
  ];

  const pricing = {
    INR: {
      junior: { original: 2999, discounted: 1999 },
      senior: { original: 4999, discounted: 3499 },
      ceo: { original: 9999, discounted: 7999 },
    },
    USD: {
      junior: { original: 49, discounted: 29 },
      senior: { original: 79, discounted: 59 },
      ceo: { original: 149, discounted: 119 },
    },
  };

  const counselorTiers = [
    {
      id: "junior",
      title: "Junior Counselor",
      icon: GraduationCap,
      experience: "1-3 years experience",
      description: "Perfect for general guidance and initial consultations",
      features: [
        "Profile evaluation",
        "University suggestions",
        "Basic visa guidance",
        "Email support for 7 days",
      ],
      color: "green",
      popular: false,
    },
    {
      id: "senior",
      title: "Senior Counselor",
      icon: Briefcase,
      experience: "5+ years experience",
      description: "Expert guidance for complex cases and applications",
      features: [
        "Comprehensive profile analysis",
        "Personalized university shortlisting",
        "SOP/LOR strategy",
        "Visa interview preparation",
        "Priority email support for 14 days",
      ],
      color: "green",
      popular: true,
    },
    {
      id: "ceo",
      title: "CEO Session",
      icon: Award,
      experience: "Industry veteran",
      description: "Direct session with our CEO for premium guidance",
      features: [
        "Strategic career planning",
        "Exclusive university connections",
        "Complete application review",
        "Mock interview with feedback",
        "Unlimited support for 30 days",
        "Priority processing",
      ],
      color: "green",
      popular: false,
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

  const getCurrencySymbol = () => {
    return currencyOptions.find((c) => c.code === currency)?.symbol || "₹";
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi, I'm interested in booking a counselling session. Can you help me?"
    );
    window.open(`https://wa.me/917337505390?text=${message}`, "_blank");
  };

  const handleBookSession = (tier) => {
    navigate("/book-counseling", { state: { selectedTier: tier } });
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
                  onClick={() => handleBookSession("senior")}
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

      {/* Who Is This For Section */}
      <section className="py-16 px-4">
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
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
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

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Choose Your Counselor
            </h2>
            <p className="text-gray-600 mb-6">
              Select the expertise level that matches your needs
            </p>
            {/* Currency Selector */}
            <div className="inline-flex items-center bg-white rounded-lg shadow-sm border p-1">
              {currencyOptions.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setCurrency(curr.code)}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition ${
                    currency === curr.code
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>{curr.flag}</span>
                  <span>{curr.code}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {counselorTiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden relative ${
                  tier.popular ? "ring-2 ring-green-500 transform md:-translate-y-2" : ""
                }`}
              >
                {tier.popular && (
                  <div className="bg-green-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <tier.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {tier.title}
                      </h3>
                      <p className="text-sm text-gray-500">{tier.experience}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                  <div className="mb-6">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-green-600">
                        {getCurrencySymbol()}
                        {pricing[currency][tier.id].discounted}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {getCurrencySymbol()}
                        {pricing[currency][tier.id].original}
                      </span>
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      Save{" "}
                      {Math.round(
                        ((pricing[currency][tier.id].original -
                          pricing[currency][tier.id].discounted) /
                          pricing[currency][tier.id].original) *
                          100
                      )}
                      %
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleBookSession(tier.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2 ${
                      tier.popular
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Choose Your Counselor",
                description: "Select the expertise level that matches your needs",
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
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
              onClick={() => handleBookSession("senior")}
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
