import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  User,
  LogOut,
  Menu,
  FileText,
  Bell,
  CheckCircle,
  AlertCircle,
  Package,
  Plane,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authService } from "../../services/authService";
import api from "../../services/api";
import StudentProfile from "./StudentProfile";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [studentUser, setStudentUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [researchPaperPurchases, setResearchPaperPurchases] = useState([]);
  const [visaApplicationPurchases, setVisaApplicationPurchases] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);

  useEffect(() => {
    // Check if student is authenticated
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      toast.error("Please login first");
      navigate("/signin");
      return;
    }

    const userData = JSON.parse(user);
    if (userData.user_role !== "student") {
      toast.error("Access denied");
      navigate("/signin");
      return;
    }

    setStudentUser(userData);
  }, [navigate]);

  // Fetch research paper and visa application purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        // Fetch research paper purchases
        const researchPaperResponse = await api.get('/student/research-papers/my-purchases');
        if (researchPaperResponse.data.success) {
          setResearchPaperPurchases(researchPaperResponse.data.data);
        }

        // Fetch visa application purchases
        const visaResponse = await api.get('/student/visa-applications/my-purchases');
        if (visaResponse.data.success) {
          setVisaApplicationPurchases(visaResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
        // Don't show error toast, just log it
      } finally {
        setLoadingPurchases(false);
      }
    };

    if (studentUser) {
      fetchPurchases();
    }
  }, [studentUser]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
      toast.success("Logged out successfully!");
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, please try again");
    } finally {
      setLoggingOut(false);
    }
  };

  // Helper function to get payment status badge
  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Paid" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: AlertCircle, label: "Pending" },
      failed: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Failed" },
      cancelled: { bg: "bg-gray-100", text: "text-gray-700", icon: AlertCircle, label: "Cancelled" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon size={14} />
        <span>{config.label}</span>
      </span>
    );
  };

  // Helper function to get case status badge
  const getCaseStatusBadge = (status) => {
    if (status === 'closed') {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          <CheckCircle size={14} />
          <span>Closed</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        <AlertCircle size={14} />
        <span>Open</span>
      </span>
    );
  };

  const menuItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "services", label: "My Services", icon: Package },
    { id: "profile", label: "Profile", icon: User },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-800">MountGC</h2>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-green-50 text-green-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="text-green-600" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {studentUser?.username || "Student"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {studentUser?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={18} />
            <span className="font-medium">
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome back, {studentUser?.username}! 👋
                </h1>
                <p className="text-sm text-gray-500">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative text-gray-600 hover:text-gray-900">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Render content based on active tab */}
          {activeTab === "home" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Active Services
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {researchPaperPurchases.filter(p => p.status === 'in_progress').length +
                     visaApplicationPurchases.filter(p => p.status === 'in_progress').length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Package className="text-blue-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Services
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {researchPaperPurchases.length + visaApplicationPurchases.length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FileText className="text-green-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Completed Services
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {researchPaperPurchases.filter(p => p.status === 'completed').length +
                     visaApplicationPurchases.filter(p => p.status === 'completed').length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Research Paper Purchases */}
          {researchPaperPurchases.length > 0 && (
            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <Package className="text-green-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">
                    My Research Paper Services
                  </h2>
                </div>

                {loadingPurchases ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading your purchases...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {researchPaperPurchases.map((purchase) => (
                      <div
                        key={purchase.purchase_id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">
                                Research Paper Drafting & Publishing Help
                              </h3>
                              {getPaymentStatusBadge(purchase.payment_status)}
                            </div>
                            <p className="text-sm text-gray-500">
                              Order ID: #{purchase.purchase_id} • Purchased on {new Date(purchase.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                            <p className="text-lg font-bold text-green-600">
                              {purchase.currency} {purchase.final_amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Co-Authors</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {purchase.co_authors}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Duration</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {purchase.duration}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Case Status</p>
                            <div className="mt-1">
                              {getCaseStatusBadge(purchase.case_status)}
                            </div>
                          </div>
                        </div>

                        {purchase.status === 'in_progress' && (
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <p className="text-sm text-green-800">
                              <strong>Your service is in progress!</strong> Our team will contact you shortly to discuss your requirements.
                            </p>
                          </div>
                        )}

                        {purchase.status === 'completed' && (
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <p className="text-sm text-blue-800">
                              <strong>Service completed!</strong> Thank you for choosing MountGC.
                            </p>
                          </div>
                        )}

                        {purchase.notes && (
                          <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Your Notes:</p>
                            <p className="text-sm text-gray-700">{purchase.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visa Application Purchases */}
          {visaApplicationPurchases.length > 0 && (
            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <Plane className="text-yellow-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">
                    My Visa Applications
                  </h2>
                </div>

                {loadingPurchases ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading your applications...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visaApplicationPurchases.map((purchase) => (
                      <div
                        key={purchase.purchase_id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">
                                Visa Application - {purchase.country}
                              </h3>
                              {getPaymentStatusBadge(purchase.payment_status)}
                            </div>
                            <p className="text-sm text-gray-500">
                              Order ID: #{purchase.order_id} • Applied on {new Date(purchase.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Amount</p>
                            <p className="text-lg font-bold text-yellow-600">
                              {purchase.currency} {purchase.final_amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Dependents</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {purchase.dependents}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Mock Sessions</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {purchase.mocks}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Case Status</p>
                            <div className="mt-1">
                              {getCaseStatusBadge(purchase.case_status)}
                            </div>
                          </div>
                        </div>

                        {purchase.visa_guarantee && (
                          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-4 rounded mb-4">
                            <p className="text-sm text-yellow-800 font-medium">
                              ✨ Visa Guarantee Included - Your application is backed by our success guarantee
                            </p>
                          </div>
                        )}

                        {purchase.status === 'in_progress' && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                            <p className="text-sm text-yellow-800">
                              <strong>Your visa application is in progress!</strong> Our team will contact you shortly to guide you through the process.
                            </p>
                          </div>
                        )}

                        {purchase.status === 'completed' && (
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <p className="text-sm text-blue-800">
                              <strong>Application process completed!</strong> Thank you for choosing MountGC.
                            </p>
                          </div>
                        )}

                        {purchase.notes && (
                          <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Your Notes:</p>
                            <p className="text-sm text-gray-700">{purchase.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No services message */}
          {researchPaperPurchases.length === 0 && visaApplicationPurchases.length === 0 && !loadingPurchases && (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="text-green-600" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Welcome to MountGC Student Portal
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't purchased any services yet. Explore our research paper drafting services and other offerings to get started on your academic journey.
                </p>
                <button
                  onClick={() => navigate('/research-paper')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Explore Services
                </button>
              </div>
            </div>
          )}

          {/* Additional Information */}
          {researchPaperPurchases.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Support Card */}
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Need Help?
                    </h3>
                    <p className="text-green-100 text-sm">
                      Our team is here to support you throughout your journey.
                    </p>
                  </div>
                  <Bell size={28} className="text-green-200" />
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={18} className="text-green-200" />
                    <span className="text-sm">24/7 Support Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={18} className="text-green-200" />
                    <span className="text-sm">Expert Guidance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={18} className="text-green-200" />
                    <span className="text-sm">Regular Updates</span>
                  </div>
                </div>
                <a
                  href={`mailto:${process.env.REACT_APP_SUPPORT_EMAIL || 'mountgc@gmail.com'}`}
                  className="mt-6 block w-full bg-white text-green-600 text-center py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                >
                  Contact Support
                </a>
              </div>

              {/* Status Overview */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Service Status Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-100 p-2 rounded">
                        <AlertCircle className="text-yellow-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Pending Payment</p>
                        <p className="text-xs text-gray-500">Awaiting payment confirmation</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-yellow-600">
                      {researchPaperPurchases.filter(p => p.payment_status === 'pending').length +
                       visaApplicationPurchases.filter(p => p.payment_status === 'pending').length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded">
                        <Package className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">In Progress</p>
                        <p className="text-xs text-gray-500">Currently being processed</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-blue-600">
                      {researchPaperPurchases.filter(p => p.status === 'in_progress').length +
                       visaApplicationPurchases.filter(p => p.status === 'in_progress').length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded">
                        <CheckCircle className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Completed</p>
                        <p className="text-xs text-gray-500">Successfully delivered</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-green-600">
                      {researchPaperPurchases.filter(p => p.status === 'completed').length +
                       visaApplicationPurchases.filter(p => p.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
            </>
          )}

          {/* My Services Tab */}
          {activeTab === "services" && (
            <>
              {/* Research Paper Services */}
              {researchPaperPurchases.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Package className="text-green-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">
                      My Research Paper Services
                    </h2>
                  </div>

                  {loadingPurchases ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Loading your purchases...</p>
                    </div>
                  ) : (
                <div className="space-y-4">
                  {researchPaperPurchases.map((purchase) => (
                    <div
                      key={purchase.purchase_id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Research Paper Drafting & Publishing Help
                            </h3>
                            {getPaymentStatusBadge(purchase.payment_status)}
                          </div>
                          <p className="text-sm text-gray-500">
                            Order ID: #{purchase.purchase_id} • Purchased on {new Date(purchase.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                          <p className="text-lg font-bold text-green-600">
                            {purchase.currency} {purchase.final_amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Co-Authors</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {purchase.co_authors}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Duration</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {purchase.duration}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Case Status</p>
                          <div className="mt-1">
                            {getCaseStatusBadge(purchase.case_status)}
                          </div>
                        </div>
                      </div>

                      {purchase.status === 'in_progress' && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                          <p className="text-sm text-green-800">
                            <strong>Your service is in progress!</strong> Our team will contact you shortly to discuss your requirements.
                          </p>
                        </div>
                      )}

                      {purchase.status === 'completed' && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Service completed!</strong> Thank you for choosing MountGC.
                          </p>
                        </div>
                      )}

                      {purchase.notes && (
                        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Your Notes:</p>
                          <p className="text-sm text-gray-700">{purchase.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
                </div>
              )}

              {/* Visa Application Services */}
              {visaApplicationPurchases.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Plane className="text-yellow-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">
                      My Visa Applications
                    </h2>
                  </div>

                  {loadingPurchases ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Loading your applications...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visaApplicationPurchases.map((purchase) => (
                        <div
                          key={purchase.purchase_id}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  Visa Application - {purchase.country}
                                </h3>
                                {getPaymentStatusBadge(purchase.payment_status)}
                              </div>
                              <p className="text-sm text-gray-500">
                                Order ID: #{purchase.order_id} • Applied on {new Date(purchase.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500 mb-1">Amount</p>
                              <p className="text-lg font-bold text-yellow-600">
                                {purchase.currency} {purchase.final_amount.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500 mb-1">Dependents</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {purchase.dependents}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500 mb-1">Mock Sessions</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {purchase.mocks}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500 mb-1">Case Status</p>
                              <div className="mt-1">
                                {getCaseStatusBadge(purchase.case_status)}
                              </div>
                            </div>
                          </div>

                          {purchase.visa_guarantee && (
                            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-4 rounded mb-4">
                              <p className="text-sm text-yellow-800 font-medium">
                                ✨ Visa Guarantee Included
                              </p>
                            </div>
                          )}

                          {purchase.status === 'in_progress' && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                              <p className="text-sm text-yellow-800">
                                <strong>Your visa application is in progress!</strong>
                              </p>
                            </div>
                          )}

                          {purchase.status === 'completed' && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                              <p className="text-sm text-blue-800">
                                <strong>Application process completed!</strong>
                              </p>
                            </div>
                          )}

                          {purchase.notes && (
                            <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500 mb-1">Your Notes:</p>
                              <p className="text-sm text-gray-700">{purchase.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* No services message */}
              {researchPaperPurchases.length === 0 && visaApplicationPurchases.length === 0 && !loadingPurchases && (
                <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="text-green-600" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      No Services Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You haven't purchased any services yet.
                    </p>
                    <button
                      onClick={() => navigate('/research-paper')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Explore Services
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Profile Tab - Embed the profile content inline */}
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto">
              <StudentProfile isEmbedded={true} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
