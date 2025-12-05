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

  const menuItems = [
    { id: "home", label: "Dashboard", icon: Home },
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

export default AdminDashboard;
