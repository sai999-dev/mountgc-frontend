import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Calendar,
  Settings,
  User,
  Menu,
  X,
  LogOut,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Plane,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Save,
  XCircle,
  Video,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authService } from "../../services/authService";
import api from "../../services/api";
import AdminProfile from "./AdminProfile";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);

  // Data states
  const [researchPaperPurchases, setResearchPaperPurchases] = useState([]);
  const [visaApplicationPurchases, setVisaApplicationPurchases] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    inProgress: 0,
    completed: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalBookings: 0,
  });

  // Counselling states
  const [counsellingServiceTypes, setCounsellingServiceTypes] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [counsellingPricing, setCounsellingPricing] = useState([]);
  const [counsellingPurchases, setCounsellingPurchases] = useState([]);
  const [counsellingActiveSubTab, setCounsellingActiveSubTab] = useState("purchases");

  // Counselling form states
  const [showServiceTypeForm, setShowServiceTypeForm] = useState(false);
  const [showCounsellorForm, setShowCounsellorForm] = useState(false);
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState(null);
  const [editingCounsellor, setEditingCounsellor] = useState(null);
  const [editingPricing, setEditingPricing] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const menuItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "counselling", label: "Counselling Sessions", icon: MessageSquare },
    { id: "research-papers", label: "Research Papers", icon: FileText },
    { id: "visa-applications", label: "Visa Applications", icon: Plane },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "users", label: "Users", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        toast.error("Please login first");
        navigate("/signin");
        return;
      }

      const userData = JSON.parse(user);
      if (userData.user_role !== "admin") {
        toast.error("Access denied. Admin access required.");
        navigate("/signin");
        return;
      }

      setAdminUser(userData);
      fetchDashboardData();
    };

    checkAuth();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all admin data
      const [purchasesRes, visaPurchasesRes, usersRes, bookingsRes] = await Promise.all([
        api.get("/admin/research-papers/purchases"),
        api.get("/admin/visa-applications/purchases"),
        api.get("/admin/users"),
        api.get("/admin/bookings"),
      ]);

      const purchases = purchasesRes.data.data || [];
      const visaPurchases = visaPurchasesRes.data.data || [];
      const usersData = usersRes.data.data || [];
      const bookingsData = bookingsRes.data.data || [];

      setResearchPaperPurchases(purchases);
      setVisaApplicationPurchases(visaPurchases);
      setUsers(usersData);
      setBookings(bookingsData);

      // Fetch counselling data
      await fetchCounsellingData();

      // Calculate stats (combine research papers and visa applications)
      const allPurchases = [...purchases, ...visaPurchases];
      const totalRevenue = allPurchases.reduce(
        (sum, p) => sum + (p.amount_paid || 0),
        0
      );

      setStats({
        totalPurchases: allPurchases.length,
        inProgress: allPurchases.filter((p) => p.status === "in_progress").length,
        completed: allPurchases.filter((p) => p.status === "completed").length,
        totalRevenue: totalRevenue,
        totalUsers: usersData.length,
        totalBookings: bookingsData.length,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const fetchCounsellingData = async () => {
    try {
      const [serviceTypesRes, counsellorsRes, pricingRes, purchasesRes] = await Promise.all([
        api.get("/counselling/admin/service-types"),
        api.get("/counselling/admin/counselors"),
        api.get("/counselling/admin/pricing"),
        api.get("/counselling/admin/purchases"),
      ]);

      setCounsellingServiceTypes(serviceTypesRes.data.data || []);
      setCounsellors(counsellorsRes.data.data || []);
      setCounsellingPricing(pricingRes.data.data || []);
      setCounsellingPurchases(purchasesRes.data.data || []);
    } catch (error) {
      console.error("Error fetching counselling data:", error);
    }
  };

  const handleTabChange = (tabId) => {
    console.log('Tab changed to:', tabId);
    setActiveTab(tabId);
    setSidebarOpen(false); // Close mobile sidebar
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const handleUpdatePurchaseStatus = async (purchaseId, status, adminNotes) => {
    try {
      await api.put(`/admin/research-papers/purchases/${purchaseId}`, {
        status,
        admin_notes: adminNotes,
      });

      toast.success("Purchase updated successfully");
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Update purchase error:", error);
      toast.error("Failed to update purchase");
    }
  };

  // ==================== COUNSELLING HANDLERS ====================

  // Service Type handlers
  const handleCreateServiceType = async (formData) => {
    try {
      await api.post("/counselling/admin/service-types", formData);
      toast.success("Service type created successfully");
      setShowServiceTypeForm(false);
      fetchCounsellingData();
    } catch (error) {
      console.error("Create service type error:", error);
      toast.error("Failed to create service type");
    }
  };

  const handleUpdateServiceType = async (id, formData) => {
    try {
      await api.put(`/counselling/admin/service-types/${id}`, formData);
      toast.success("Service type updated successfully");
      setEditingServiceType(null);
      fetchCounsellingData();
    } catch (error) {
      console.error("Update service type error:", error);
      toast.error("Failed to update service type");
    }
  };

  const handleDeleteServiceType = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service type?")) return;
    try {
      await api.delete(`/counselling/admin/service-types/${id}`);
      toast.success("Service type deleted successfully");
      fetchCounsellingData();
    } catch (error) {
      console.error("Delete service type error:", error);
      toast.error("Failed to delete service type");
    }
  };

  // Counsellor handlers
  const handleCreateCounsellor = async (formData) => {
    try {
      await api.post("/counselling/admin/counselors", formData);
      toast.success("Counsellor created successfully");
      setShowCounsellorForm(false);
      fetchCounsellingData();
    } catch (error) {
      console.error("Create counsellor error:", error);
      toast.error("Failed to create counsellor");
    }
  };

  const handleUpdateCounsellor = async (id, formData) => {
    try {
      await api.put(`/counselling/admin/counselors/${id}`, formData);
      toast.success("Counsellor updated successfully");
      setEditingCounsellor(null);
      fetchCounsellingData();
    } catch (error) {
      console.error("Update counsellor error:", error);
      toast.error("Failed to update counsellor");
    }
  };

  const handleDeleteCounsellor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this counsellor?")) return;
    try {
      await api.delete(`/counselling/admin/counselors/${id}`);
      toast.success("Counsellor deleted successfully");
      fetchCounsellingData();
    } catch (error) {
      console.error("Delete counsellor error:", error);
      toast.error("Failed to delete counsellor");
    }
  };

  // Pricing handlers
  const handleCreatePricing = async (formData) => {
    try {
      await api.post("/counselling/admin/pricing", formData);
      toast.success("Pricing created successfully");
      setShowPricingForm(false);
      fetchCounsellingData();
    } catch (error) {
      console.error("Create pricing error:", error);
      toast.error("Failed to create pricing");
    }
  };

  const handleUpdatePricing = async (id, formData) => {
    try {
      await api.put(`/counselling/admin/pricing/${id}`, formData);
      toast.success("Pricing updated successfully");
      setEditingPricing(null);
      fetchCounsellingData();
    } catch (error) {
      console.error("Update pricing error:", error);
      toast.error("Failed to update pricing");
    }
  };

  const handleDeletePricing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pricing?")) return;
    try {
      await api.delete(`/counselling/admin/pricing/${id}`);
      toast.success("Pricing deleted successfully");
      fetchCounsellingData();
    } catch (error) {
      console.error("Delete pricing error:", error);
      toast.error("Failed to delete pricing");
    }
  };

  // Counselling Purchase handlers
  const handleUpdateCounsellingPurchase = async (id, formData) => {
    try {
      await api.put(`/counselling/admin/purchases/${id}`, formData);
      toast.success("Purchase updated successfully");
      setEditingPurchase(null);
      fetchCounsellingData();
    } catch (error) {
      console.error("Update purchase error:", error);
      toast.error("Failed to update purchase");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">MountGC</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTabChange(item.id);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
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
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="text-green-600" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {adminUser?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {adminUser?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-green-600">MountGC Admin</h1>
            <div className="w-6" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Tab (Home) - Active: {activeTab} */}
          {activeTab === "home" && (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Admin Dashboard
                </h2>
                <p className="text-gray-600 mt-1">
                  Welcome back, {adminUser?.username}! Here's your overview.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Total Purchases
                      </p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        {stats.totalPurchases}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Package className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        In Progress
                      </p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        {stats.inProgress}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                      <Clock className="text-yellow-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Completed
                      </p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        {stats.completed}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Total Revenue
                      </p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        ${stats.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Total Users
                    </h3>
                    <Users className="text-indigo-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.totalUsers}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Registered users in the system
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Total Bookings
                    </h3>
                    <Calendar className="text-pink-600" size={24} />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.totalBookings}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Counseling sessions booked
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Recent Purchases
                </h3>
                {researchPaperPurchases.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600">No purchases yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {researchPaperPurchases.slice(0, 5).map((purchase) => (
                      <div
                        key={purchase.purchase_id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {purchase.user?.username || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {purchase.user?.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Order #{purchase.order_id} • ${purchase.amount_paid}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              purchase.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : purchase.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {purchase.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Counselling Sessions Tab */}
          {activeTab === "counselling" && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Counselling Sessions Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage service types, counsellors, pricing, and student purchases
                </p>
              </div>

              {/* Sub-tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["purchases", "service-types", "counsellors", "pricing"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCounsellingActiveSubTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      counsellingActiveSubTab === tab
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab === "purchases" ? "Purchases" :
                     tab === "service-types" ? "Service Types" :
                     tab === "counsellors" ? "Counsellors" : "Pricing"}
                  </button>
                ))}
              </div>

              {/* Purchases Sub-tab */}
              {counsellingActiveSubTab === "purchases" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Student Purchases</h3>
                  </div>
                  {counsellingPurchases.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="mx-auto text-gray-400 mb-3" size={48} />
                      <p className="text-gray-600">No counselling purchases yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Student</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Service</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Counsellor</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Payment</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {counsellingPurchases.map((purchase) => (
                            <tr key={purchase.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">{purchase.order_id}</td>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{purchase.user?.username || purchase.name}</p>
                                  <p className="text-xs text-gray-600">{purchase.user?.email || purchase.email}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800">{purchase.service_type?.name || "N/A"}</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{purchase.counselor?.name || "N/A"}</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{purchase.currency} {purchase.amount_paid}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  purchase.status === "completed" ? "bg-green-100 text-green-700" :
                                  purchase.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                                  purchase.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                                  "bg-gray-100 text-gray-700"
                                }`}>
                                  {purchase.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  purchase.payment_status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {purchase.payment_status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => setEditingPurchase(purchase)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Service Types Sub-tab */}
              {counsellingActiveSubTab === "service-types" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Service Types</h3>
                    <button
                      onClick={() => setShowServiceTypeForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus size={16} /> Add Service Type
                    </button>
                  </div>
                  {counsellingServiceTypes.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No service types yet. Add one to get started.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Duration</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {counsellingServiceTypes.map((type) => (
                            <tr key={type.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">{type.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{type.description || "-"}</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{type.duration_minutes} mins</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  type.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {type.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => setEditingServiceType(type)} className="text-blue-600 hover:text-blue-800">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteServiceType(type.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Counsellors Sub-tab */}
              {counsellingActiveSubTab === "counsellors" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Counsellors</h3>
                    <button
                      onClick={() => setShowCounsellorForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus size={16} /> Add Counsellor
                    </button>
                  </div>
                  {counsellors.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No counsellors yet. Add one to get started.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {counsellors.map((counsellor) => (
                            <tr key={counsellor.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">{counsellor.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{counsellor.role || "-"}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{counsellor.email || "-"}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  counsellor.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {counsellor.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => setEditingCounsellor(counsellor)} className="text-blue-600 hover:text-blue-800">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteCounsellor(counsellor.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Sub-tab */}
              {counsellingActiveSubTab === "pricing" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Pricing Configuration</h3>
                    <button
                      onClick={() => setShowPricingForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus size={16} /> Add Pricing
                    </button>
                  </div>
                  {counsellingPricing.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No pricing configured yet. Add pricing to enable purchases.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Service Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Counsellor</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Currency</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Original</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Discounted</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {counsellingPricing.map((pricing) => (
                            <tr key={pricing.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">{pricing.service_type?.name || "N/A"}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{pricing.counselor?.name || "N/A"}</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{pricing.currency}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 line-through">{pricing.original_price}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-green-600">{pricing.discounted_price}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  pricing.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {pricing.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => setEditingPricing(pricing)} className="text-blue-600 hover:text-blue-800">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeletePricing(pricing.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Service Type Form Modal */}
              {(showServiceTypeForm || editingServiceType) && (
                <ServiceTypeFormModal
                  serviceType={editingServiceType}
                  onSave={editingServiceType ? (data) => handleUpdateServiceType(editingServiceType.id, data) : handleCreateServiceType}
                  onClose={() => { setShowServiceTypeForm(false); setEditingServiceType(null); }}
                />
              )}

              {/* Counsellor Form Modal */}
              {(showCounsellorForm || editingCounsellor) && (
                <CounsellorFormModal
                  counsellor={editingCounsellor}
                  onSave={editingCounsellor ? (data) => handleUpdateCounsellor(editingCounsellor.id, data) : handleCreateCounsellor}
                  onClose={() => { setShowCounsellorForm(false); setEditingCounsellor(null); }}
                />
              )}

              {/* Pricing Form Modal */}
              {(showPricingForm || editingPricing) && (
                <PricingFormModal
                  pricing={editingPricing}
                  serviceTypes={counsellingServiceTypes}
                  counsellors={counsellors}
                  onSave={editingPricing ? (data) => handleUpdatePricing(editingPricing.id, data) : handleCreatePricing}
                  onClose={() => { setShowPricingForm(false); setEditingPricing(null); }}
                />
              )}

              {/* Purchase Edit Modal */}
              {editingPurchase && (
                <PurchaseEditModal
                  purchase={editingPurchase}
                  onSave={(data) => handleUpdateCounsellingPurchase(editingPurchase.id, data)}
                  onClose={() => setEditingPurchase(null)}
                />
              )}
            </div>
          )}

          {/* Visa Applications Tab */}
          {activeTab === "visa-applications" && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Visa Applications Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage all visa application purchases and cases
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {visaApplicationPurchases.length === 0 ? (
                  <div className="text-center py-12">
                    <Plane className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600">No visa application purchases yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Country
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Currency
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Payment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {visaApplicationPurchases.map((purchase) => (
                          <tr key={purchase.purchase_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                              {purchase.order_id}
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {purchase.user?.username || purchase.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {purchase.user?.email || purchase.email}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800">
                              {purchase.country}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800">
                              {purchase.currency}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800">
                              {purchase.currency} {purchase.final_amount}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  purchase.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : purchase.status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {purchase.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  purchase.payment_status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {purchase.payment_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(purchase.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Research Papers Tab */}
          {activeTab === "research-papers" && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Research Papers Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage all research paper purchases and cases
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {researchPaperPurchases.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600">No research paper purchases yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Payment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {researchPaperPurchases.map((purchase) => (
                          <tr key={purchase.purchase_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                              {purchase.order_id}
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {purchase.user?.username}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {purchase.user?.email}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800">
                              ${purchase.amount_paid}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  purchase.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : purchase.status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {purchase.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  purchase.payment_status === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {purchase.payment_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(purchase.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Counseling Bookings
                </h2>
                <p className="text-gray-600 mt-1">
                  View all counseling session bookings
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.booking_id}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {booking.user?.username || "Unknown User"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.user?.email}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Service:</span>{" "}
                              {booking.service_type}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(booking.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {booking.status || "pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  User Management
                </h2>
                <p className="text-gray-600 mt-1">
                  View and manage all registered users
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            User ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Username
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.user_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800">
                              {user.user_id}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">
                              {user.username}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  user.user_role === "admin"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {user.user_role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  user.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {user.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto">
              <AdminProfile isEmbedded={true} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// ==================== MODAL COMPONENTS ====================

// Service Type Form Modal
const ServiceTypeFormModal = ({ serviceType, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: serviceType?.name || "",
    description: serviceType?.description || "",
    duration_minutes: serviceType?.duration_minutes || 30,
    is_active: serviceType?.is_active ?? true,
    display_order: serviceType?.display_order || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {serviceType ? "Edit Service Type" : "Add Service Type"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-green-600"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {serviceType ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Counsellor Form Modal
const CounsellorFormModal = ({ counsellor, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: counsellor?.name || "",
    role: counsellor?.role || "",
    email: counsellor?.email || "",
    bio: counsellor?.bio || "",
    is_active: counsellor?.is_active ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {counsellor ? "Edit Counsellor" : "Add Counsellor"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Senior Counsellor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="counsellor_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-green-600"
            />
            <label htmlFor="counsellor_active" className="text-sm text-gray-700">Active</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {counsellor ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Pricing Form Modal
const PricingFormModal = ({ pricing, serviceTypes, counsellors, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    service_type_id: pricing?.service_type_id || "",
    counselor_id: pricing?.counselor_id || "",
    currency: pricing?.currency || "USD",
    original_price: pricing?.original_price || 0,
    discounted_price: pricing?.discounted_price || 0,
    is_active: pricing?.is_active ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      service_type_id: parseInt(formData.service_type_id),
      counselor_id: parseInt(formData.counselor_id),
      original_price: parseFloat(formData.original_price),
      discounted_price: parseFloat(formData.discounted_price),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {pricing ? "Edit Pricing" : "Add Pricing"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
            <select
              value={formData.service_type_id}
              onChange={(e) => setFormData({ ...formData, service_type_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Service Type</option>
              {serviceTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Counsellor *</label>
            <select
              value={formData.counselor_id}
              onChange={(e) => setFormData({ ...formData, counselor_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Counsellor</option>
              {counsellors.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
              <input
                type="number"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price *</label>
              <input
                type="number"
                value={formData.discounted_price}
                onChange={(e) => setFormData({ ...formData, discounted_price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pricing_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-green-600"
            />
            <label htmlFor="pricing_active" className="text-sm text-gray-700">Active</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {pricing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Purchase Edit Modal
const PurchaseEditModal = ({ purchase, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    status: purchase?.status || "pending",
    admin_notes: purchase?.admin_notes || "",
    meeting_link: purchase?.meeting_link || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Purchase</h3>

        {/* Purchase Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">Order: <span className="font-semibold text-gray-800">{purchase.order_id}</span></p>
          <p className="text-sm text-gray-600">Student: <span className="font-semibold text-gray-800">{purchase.user?.username || purchase.name}</span></p>
          <p className="text-sm text-gray-600">Email: <span className="font-semibold text-gray-800">{purchase.user?.email || purchase.email}</span></p>
          <p className="text-sm text-gray-600">Service: <span className="font-semibold text-gray-800">{purchase.service_type?.name}</span></p>
          <p className="text-sm text-gray-600">Counsellor: <span className="font-semibold text-gray-800">{purchase.counselor?.name}</span></p>
          <p className="text-sm text-gray-600">Amount: <span className="font-semibold text-green-600">{purchase.currency} {purchase.amount_paid}</span></p>
          {purchase.student_notes && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">Student Notes:</p>
              <p className="text-sm text-gray-800 italic">"{purchase.student_notes}"</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
            <input
              type="url"
              value={formData.meeting_link}
              onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://meet.google.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
            <textarea
              value={formData.admin_notes}
              onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              placeholder="Internal notes about this counselling session..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
