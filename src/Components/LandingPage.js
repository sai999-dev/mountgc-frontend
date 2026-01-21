import React from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  FileText,
  Plane,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Globe,
  Award,
  Clock,
  Shield,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Target,
  Sparkles,
} from "lucide-react";
import heroImage from "../Assets/herosection.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Users,
      title: "Counselling Session",
      description:
        "Get personalized 1-on-1 guidance from expert counselors via Google Meet. Discuss your goals, get clarity on your study/work abroad journey.",
      features: ["60 min sessions", "Expert counselors", "Personalized advice"],
      route: "/counselling-session",
      color: "green",
    },
    {
      icon: FileText,
      title: "Research Paper Publishing",
      description:
        "Boost your academic profile with peer-reviewed publications in IEEE, Springer, Elsevier. Essential for MS/PhD and O-1/EB-1 visas.",
      features: ["Top journals", "End-to-end support", "Co-authorship options"],
      route: "/research-paper",
      color: "green",
      badge: "ON FIRE",
    },
    {
      icon: Plane,
      title: "Visa Application Help",
      description:
        "Complete visa application assistance for USA, Canada, UK. From documentation to mock interviews, we've got you covered.",
      features: ["Visa guarantee", "Mock interviews", "24/7 support"],
      route: "/visa-application",
      color: "green",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Students Helped", icon: GraduationCap },
    { value: "95%", label: "Success Rate", icon: TrendingUp },
    { value: "50+", label: "Countries", icon: Globe },
    { value: "4.9", label: "Rating", icon: Star },
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "Expert Counselors",
      description: "Our team consists of experienced professionals who have helped thousands of students achieve their dreams.",
    },
    {
      icon: Shield,
      title: "Visa Guarantee",
      description: "We offer a visa guarantee with our premium packages. If you don't get your visa, we'll support you until you do.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our support team is always available to help you with any queries or concerns throughout your journey.",
    },
    {
      icon: Target,
      title: "Personalized Approach",
      description: "Every student is unique. We create customized plans tailored to your specific goals and background.",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "MS Computer Science, Stanford",
      content: "MountGC helped me throughout my application process. Their research paper service boosted my profile significantly!",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      role: "PhD Biology, MIT",
      content: "The counselling sessions were incredibly helpful. They guided me through every step of my visa application.",
      rating: 5,
    },
    {
      name: "Ananya Patel",
      role: "MBA, Harvard Business School",
      content: "Professional, responsive, and genuinely caring. I couldn't have done it without MountGC's support!",
      rating: 5,
    },
  ];

  const destinations = [
    { country: "USA", flag: "🇺🇸", universities: "4,000+ Universities" },
    { country: "Canada", flag: "🇨🇦", universities: "100+ Universities" },
    { country: "UK", flag: "🇬🇧", universities: "160+ Universities" },
    { country: "Germany", flag: "🇩🇪", universities: "400+ Universities" },
    { country: "Australia", flag: "🇦🇺", universities: "43+ Universities" },
    { country: "Ireland", flag: "🇮🇪", universities: "30+ Universities" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-green-400 text-sm font-medium">Your Gateway To Global Success</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Transform Your
                <span className="text-green-500"> Dreams </span>
                Into Reality
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join thousands of students and professionals on their journey to study, work, and immigrate abroad. Expert guidance, proven results.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/services")}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition flex items-center space-x-2 shadow-lg shadow-green-500/25"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/counselling-session")}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition border border-white/20"
                >
                  Book Free Consultation
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center space-x-6 mt-10">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">10,000+ students trust us</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden md:block relative">
              <div className="relative">
                <img
                  src={heroImage}
                  alt="Study Abroad Success"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                {/* Optional overlay glow effect */}
                <div className="absolute -inset-4 bg-green-500/20 rounded-3xl blur-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <stat.icon className="w-6 h-6 text-green-500" />
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need To Succeed Abroad
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From expert counselling to visa assistance, we provide comprehensive support for your international education journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
              >
                {service.badge && (
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1 text-center">
                    {service.badge}
                  </div>
                )}
                <div className="p-8">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition">
                    <service.icon className="w-7 h-7 text-green-600 group-hover:text-white transition" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate(service.route)}
                    className="w-full bg-green-50 hover:bg-green-500 text-green-600 hover:text-white font-semibold py-3 rounded-lg transition flex items-center justify-center space-x-2"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/services")}
              className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
                Why MountGC
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Your Success Is Our Priority
              </h2>
              <p className="text-gray-600 mb-8">
                We're not just another consulting firm. We're your partners in achieving your international education dreams. Our personalized approach and proven track record set us apart.
              </p>

              <div className="space-y-6">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Ready to Start Your Journey?</h3>
                <p className="text-green-100 mb-8">
                  Book a free consultation with our experts and get personalized guidance for your study abroad plans.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span>Free 15-min consultation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span>Personalized roadmap</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span>No obligations</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/counselling-session")}
                  className="w-full bg-white text-green-600 font-semibold py-4 rounded-lg hover:bg-green-50 transition"
                >
                  Book Free Consultation
                </button>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-200 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-100 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
              Study Destinations
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Top Study Destinations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We help you navigate the application process for top universities across the globe.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map((dest, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition cursor-pointer border border-gray-100 hover:border-green-200"
              >
                <div className="text-4xl mb-3">{dest.flag}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{dest.country}</h3>
                <p className="text-xs text-gray-500">{dest.universities}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what students who achieved their dreams with MountGC have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin Your Global Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who turned their dreams into reality with MountGC.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/services")}
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition shadow-lg"
            >
              Explore Services
            </button>
            <button
              onClick={() => {
                const message = encodeURIComponent("Hi, I'm interested in your services!");
                window.open(`https://wa.me/917337505390?text=${message}`, "_blank");
              }}
              className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition border-2 border-white flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
              Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your journey to studying abroad is just 4 simple steps away.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Book Consultation", description: "Schedule a free session with our expert counselors", icon: Users },
              { step: 2, title: "Get Your Roadmap", description: "Receive a personalized plan for your goals", icon: Target },
              { step: 3, title: "Expert Support", description: "Get help with applications, documents & visa", icon: BookOpen },
              { step: 4, title: "Achieve Your Dream", description: "Get admitted to your dream university abroad", icon: GraduationCap },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-green-200"></div>
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-green-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mx-auto -mt-10 mb-6 border-2 border-white">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
