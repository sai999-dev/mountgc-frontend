import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../services/api";

const AdminProfile = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = () => {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        toast.error("Please login first");
        navigate("/signin");
        return;
      }

      const userData = JSON.parse(user);
      if (userData.user_role !== "admin") {
        toast.error("Access denied");
        navigate("/signin");
        return;
      }

      setAdminUser(userData);
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
      });
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const response = await api.put("/user/profile", {
        username: formData.username,
      });

      if (response.data.success) {
        // Update localStorage
        const updatedUser = { ...adminUser, username: formData.username };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setAdminUser(updatedUser);

        // Dispatch auth change event to update navbar
        window.dispatchEvent(new Event("authChange"));

        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: adminUser?.username || "",
      email: adminUser?.email || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Wrapper classes based on embedded mode
  const wrapperClass = isEmbedded
    ? ""
    : "min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8";

  return (
    <div className={wrapperClass}>
      {!isEmbedded && <Toaster position="top-right" />}

      <div className={isEmbedded ? "" : "max-w-4xl mx-auto"}>
        {/* Header - only show back button when not embedded */}
        {!isEmbedded && (
          <div className="mb-6">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-green-600 hover:text-green-700 font-medium mb-2 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Admin Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your admin account information
            </p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <Shield className="text-green-600" size={40} />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{adminUser?.username}</h2>
                <p className="text-green-100 text-sm">Administrator Account</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Action Buttons */}
            <div className="flex justify-end mb-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={18} />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="text-gray-500" size={20} />
                    <span className="text-gray-800 font-medium">
                      {adminUser?.username}
                    </span>
                  </div>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Mail className="text-gray-500" size={20} />
                  <span className="text-gray-800">{adminUser?.email}</span>
                  {adminUser?.email_verify && (
                    <CheckCircle className="text-green-600 ml-auto" size={20} />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed for security reasons
                </p>
              </div>

              {/* Account Details */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Account Status */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Shield className="text-green-600" size={18} />
                      <span className="text-sm font-semibold text-gray-700">
                        Account Status
                      </span>
                    </div>
                    <p className="text-green-700 font-medium">
                      {adminUser?.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>

                  {/* Email Verification */}
                  <div
                    className={`p-4 rounded-lg border ${
                      adminUser?.email_verify
                        ? "bg-green-50 border-green-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {adminUser?.email_verify ? (
                        <CheckCircle className="text-green-600" size={18} />
                      ) : (
                        <AlertCircle className="text-yellow-600" size={18} />
                      )}
                      <span className="text-sm font-semibold text-gray-700">
                        Email Verification
                      </span>
                    </div>
                    <p
                      className={`font-medium ${
                        adminUser?.email_verify
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {adminUser?.email_verify ? "Verified" : "Not Verified"}
                    </p>
                  </div>

                  {/* Member Since */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="text-blue-600" size={18} />
                      <span className="text-sm font-semibold text-gray-700">
                        Member Since
                      </span>
                    </div>
                    <p className="text-blue-700 font-medium">
                      {adminUser?.created_at
                        ? new Date(adminUser.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>

                  {/* User Role */}
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Shield className="text-purple-600" size={18} />
                      <span className="text-sm font-semibold text-gray-700">
                        User Role
                      </span>
                    </div>
                    <p className="text-purple-700 font-medium capitalize">
                      {adminUser?.user_role || "Administrator"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Notice */}
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-purple-900 mb-1">
                Administrator Access
              </h4>
              <p className="text-sm text-purple-800">
                You have full administrative privileges. Use your access
                responsibly and maintain the security of your account. Never
                share your login credentials with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
