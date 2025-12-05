import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, FileText, Plane, MessageCircle } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Users className="text-green-500" size={28} />,
      title: "Counselling Session",
      desc: "Google Meet session with our counsellors. Get transparency on your case for study/work overseas. Charges fully adjustable in services' pricing.",
      route: "/book-counseling",
    },
    {
      icon: <FileText className="text-green-500" size={28} />,
      title: "Research Paper Drafting & Publishing Help",
      desc: "Publishing credible research papers with your name on them can help boost your profile! Extremely crucial for MS/PhD and O-1/EB-1 visa applicants.",
      tag: "ON FIRE",
      route: "/research-paper",
    },
    {
      icon: <Plane className="text-green-500" size={28} />,
      title: "Visa Application Help",
      desc: "Ace the visa application through our help in the paperwork, financial planning, and visa interview mock rounds. Applicable for USA, Canada, UK, Germany, and more.",
      tag: "ON FIRE",
      route: "/visa-application",
    },
  ];

  return (
    <div className="px-4 md:px-20 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 tracking-wide">SERVICES</h1>
        <div className="w-20 h-1 bg-green-500 mx-auto mb-6"></div>
        <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Having worked with students from over 55 countries and interviewed a
          range of professors from various fields, I know exactly what the
          admissions committee likes to see in their applicants. Now, you can
          use my secrets to cracking the admissions process and implement it in
          your applications. The services listed are offered for{" "}
          <strong>
            Bachelor's, Master's (MS, MBA, Finance, Economics, Pharma,
            Dentistry, etc.), and PhD
          </strong>{" "}
          applicants.
        </p>
        <p className="text-green-600 mt-3 font-medium">
          To see the charges, you can click on the service, select the currency
          and other relevant options (if any). Crypto payments now accepted!
        </p>
      </div>

      <div className="bg-green-50 py-4 px-6 rounded-lg flex justify-center items-center gap-4 mb-8 flex-wrap text-center">
        <span className="text-gray-700 text-sm md:text-base">
          To reach our sales team
        </span>
        <a
          href="https://wa.me/917337505390"
          target="_blank"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
        >
          <MessageCircle size={18} /> WhatsApp Us →
        </a>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for a Service"
            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {services.map((service, idx) => (
          <div
            key={idx}
            onClick={() => service.route && navigate(service.route)}
            className={`relative bg-white border border-gray-200 rounded-xl shadow-sm p-6 transition duration-200 cursor-pointer ${
              service.route
                ? "hover:shadow-xl hover:border-green-500"
                : "hover:shadow-md"
            }`}
          >
            {service.tag && (
              <div className="absolute top-0 right-0 bg-green-500 text-xs font-bold text-white px-2 py-1 rounded-bl-md">
                {service.tag}
              </div>
            )}
            <div className="flex items-start space-x-3">
              {service.icon}
              <div>
                <h2 className="font-semibold text-lg mb-1">{service.title}</h2>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
