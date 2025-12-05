import React from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 px-6 md:px-20 relative">
      {/* Footer Grid */}
      <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-10">
        {/* Company Info */}
        <div>
          <div className="flex items-center mb-4">
            <div className="bg-green-500 w-10 h-10 flex items-center justify-center">
              <span className="text-gray-900 font-extrabold text-lg">M</span>
            </div>
            <span className="text-green-500 font-bold text-xl ml-2">
              MountGC
            </span>
          </div>
          <div className="flex space-x-4 mb-4">
            <Facebook className="w-5 h-5 hover:text-green-400 cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-green-400 cursor-pointer" />
            <Youtube className="w-5 h-5 hover:text-green-400 cursor-pointer" />
            <Linkedin className="w-5 h-5 hover:text-green-400 cursor-pointer" />
          </div>
          <p className="text-sm text-gray-400">
            © Copyright <span className="text-green-400 font-semibold">MountGC</span> 2025.
            All Rights Reserved.
          </p>
        </div>

        {/* Popular Services */}
        <div>
          <h3 className="text-white font-semibold mb-3">POPULAR SERVICES</h3>
          <ul className="space-y-2 text-sm">
            <li>Visa Application Help</li>
            <li>Complete Application Help</li>
            <li>Research Paper Drafting & Publishing Help</li>
            <li>Apply For An O-1 Visa</li>
            <li>Apply For An EB-1 Visa</li>
            <li>Counselling Session</li>
            <li>Profile Evaluation & University Shortlisting</li>
            <li>Statement of Purpose/Essay Drafting</li>
            <li>US Visa Mock Interview</li>
            <li className="text-green-400 cursor-pointer hover:underline">
              See all services
            </li>
          </ul>
        </div>

        {/* Popular Programs */}
        <div>
          <h3 className="text-white font-semibold mb-3">POPULAR PROGRAMS</h3>
          <ul className="space-y-2 text-sm">
            <li>Computer Engineering</li>
            <li>Data Science</li>
            <li>Business</li>
            <li>Biology</li>
            <li>Architecture</li>
            <li>Psychology</li>
            <li>Pharmacy</li>
            <li>Textile Design</li>
          </ul>
        </div>

        {/* Top Universities */}
        <div>
          <h3 className="text-white font-semibold mb-3">TOP UNIVERSITIES</h3>
          <ul className="space-y-2 text-sm">
            <li>United States</li>
            <li>Canada</li>
            <li>United Kingdom</li>
            <li>Germany</li>
            <li>Australia</li>
            <li>Singapore</li>
            <li>Ireland</li>
            <li>Netherlands</li>
          </ul>
        </div>

        {/* Company + Resources */}
        <div className="flex flex-col space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3">COMPANY</h3>
            <ul className="space-y-2 text-sm">
              <li>Home</li>
              <li>Careers</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">RESOURCES</h3>
            <ul className="space-y-2 text-sm">
              <li>Research Groups</li>
              <li>Scholarship</li>
              <li>Education Loan Support</li>
              <li>Reviews</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">MOUNTGC TOOLS</h3>
            <ul className="space-y-2 text-sm">
              <li>RateMyChances</li>
              <li>UniPredict</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scroll To Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-6 right-6 bg-gray-800 hover:bg-yellow-400 text-white hover:text-black p-3 rounded-full transition"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
};

export default Footer;
