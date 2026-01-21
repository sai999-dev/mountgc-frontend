import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Services we provide
  const services = [
    { name: "Counselling Session", route: "/counselling-session" },
    { name: "Research Paper Publishing", route: "/research-paper" },
    { name: "Visa Application Help", route: "/visa-application" },
    { name: "All Services", route: "/services", highlight: true },
  ];

  // Quick links
  const quickLinks = [
    { name: "Home", route: "/" },
    { name: "Services", route: "/services" },
    { name: "Sign In", route: "/signin" },
    { name: "Sign Up", route: "/signup" },
  ];

  // Study destinations
  const destinations = [
    { name: "United States", flag: "🇺🇸" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Ireland", flag: "🇮🇪" },
  ];

  // Social media links
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi, I'm interested in your services!");
    window.open(`https://wa.me/917337505390?text=${message}`, "_blank");
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-6 md:px-20 relative">
      {/* Footer Grid */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10 mb-10">
        {/* Company Info */}
        <div>
          <Link to="/" className="flex items-center mb-4 hover:opacity-90 transition">
            <div className="bg-green-500 w-10 h-10 flex items-center justify-center rounded">
              <span className="text-gray-900 font-extrabold text-lg">M</span>
            </div>
            <span className="text-green-500 font-bold text-xl ml-2">
              MountGC
            </span>
          </Link>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Your trusted partner for study abroad guidance. We help students achieve their dreams of international education.
          </p>

          {/* Social Media */}
          <div className="flex space-x-3 mb-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-green-500 rounded-full flex items-center justify-center transition"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Our Services */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">OUR SERVICES</h3>
          <ul className="space-y-3 text-sm">
            {services.map((service, index) => (
              <li key={index}>
                <Link
                  to={service.route}
                  className={`hover:text-green-400 transition flex items-center ${
                    service.highlight ? "text-green-400 font-medium" : ""
                  }`}
                >
                  {service.highlight && <span className="mr-1">→</span>}
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">QUICK LINKS</h3>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.route}
                  className="hover:text-green-400 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Study Destinations */}
          <h3 className="text-white font-semibold mb-4 mt-6 text-lg">STUDY DESTINATIONS</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {destinations.map((dest, index) => (
              <div key={index} className="flex items-center space-x-1">
                <span>{dest.flag}</span>
                <span>{dest.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">CONTACT US</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <a href="mailto:support@mountgc.com" className="hover:text-green-400 transition">
                support@mountgc.com
              </a>
            </li>
            <li className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <button onClick={handleWhatsAppClick} className="hover:text-green-400 transition text-left">
                +91 73375 05390
              </button>
            </li>
            <li className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>India</span>
            </li>
          </ul>

          {/* WhatsApp CTA */}
          <button
            onClick={handleWhatsAppClick}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
          >
            <Phone className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <p className="text-sm text-gray-400">
            © {currentYear} <span className="text-green-400 font-semibold">MountGC</span>. All Rights Reserved.
          </p>

          {/* Legal Links */}
          <div className="flex space-x-6 text-sm">
            <Link to="/" className="hover:text-green-400 transition">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-green-400 transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll To Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-6 right-6 bg-gray-800 hover:bg-green-500 text-white p-3 rounded-full transition shadow-lg"
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
};

export default Footer;
