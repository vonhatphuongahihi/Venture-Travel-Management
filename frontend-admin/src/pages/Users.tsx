import {
  ChevronDown,
  Eye,
  Search,
  ShieldCheck,
  ShieldX,
  Trash2,
  UserPlus,
  UsersIcon,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import avatarAdmin from "../assets/avatar-admin.jpg";
import Layout from "../components/Layout";
import type { User } from "@/types";
import {
  useDeleteUser,
  useGetUsers,
  useGetUsersStatistics,
  useToggleUserStatus,
} from "@/services/users/userHook";
import { useDebounce } from "@uidotdev/usehooks";

const UsersScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const toggleUserStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();
  const { data: userStatistics, isLoading: isLoadingStatistics } = useGetUsersStatistics();
  const {
    data: paginatedUsers,
    error: errorGetUsers,
    isError: isErrorGetUsers,
    isLoading: isLoadingGetUsers,
  } = useGetUsers({
    search: debouncedSearchTerm || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active" ? true : false,
  });

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Bị vô hiệu" },
  ];

  const selectedOption = statusOptions.find((option) => option.value === statusFilter);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handler functions
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete.userId);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  if (isErrorGetUsers) {
    return (
      <div>Error: {errorGetUsers instanceof Error ? errorGetUsers.message : "Unknown error"}</div>
    );
  }

  return (
    <Layout title="Người dùng">
      {isLoadingStatistics ? (
        <p>Loading...</p>
      ) : (
        <div className="p-2 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            {/* Tổng số người dùng */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-[#0A0A0A] mb-1">Tổng số người dùng</p>
                  <p className="text-xl font-bold">{userStatistics?.totalUsers || "-"}</p>
                </div>
              </div>
            </div>

            {/* Số người dùng đang hoạt động */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-[#0A0A0A] mb-1">Số người dùng đang hoạt động</p>
                  <p className="text-xl font-bold">{userStatistics?.activeUsers || "-"}</p>
                </div>
              </div>
            </div>

            {/* Số người dùng bị vô hiệu */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <ShieldX className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-[#0A0A0A] mb-1">Số người dùng bị vô hiệu</p>
                  <p className="text-xl font-bold">{userStatistics?.inactiveUsers || "-"}</p>
                </div>
              </div>
            </div>

            {/* Số người dùng mới trong tháng */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-[#0A0A0A] mb-1">Số người dùng mới trong tháng</p>
                  <p className="text-xl font-bold">{userStatistics?.newUsersInMonth || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-4 py-2 border-0 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="ml-4 relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer hover:border-gray-300 transition-colors min-w-[160px]"
                >
                  <span>{selectedOption?.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Custom dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          statusFilter === option.value
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-900"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {isLoadingGetUsers ? (
                <div>
                  <p>Loading...</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-white border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-[#0A0A0A]">
                        Tên người dùng
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-[#0A0A0A]">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-[#0A0A0A]">
                        Ngày sinh
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-[#0A0A0A]">
                        Vai trò
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-sm text-[#0A0A0A]">
                        Trạng thái
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-sm text-[#0A0A0A]">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedUsers?.content.map((user) => (
                      <tr key={user.userId} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <img
                              src={user.profilePhoto ?? avatarAdmin}
                              alt={user.name}
                              className="w-7 h-7 rounded-full mr-3"
                            />
                            <span className="text-sm text-[#0A0A0A]">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#0A0A0A]">{user.email}</td>
                        <td className="py-3 px-4 text-sm text-[#0A0A0A]">
                          {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-[#0A0A0A]">
                          {user.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex px-2 py-[5px] text-[13px] font-medium rounded ${
                              user.isActive
                                ? "bg-[#DCFCE7] text-[#008236]"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.isActive ? "Đang hoạt động" : "Bị vô hiệu"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            {/* View Button */}
                            <button
                              onClick={() => handleViewUser(user)}
                              className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-200"
                            >
                              <Eye className="w-[18px] h-[18px] text-gray-600" />
                            </button>

                            {/* Toggle Status Button */}
                            <button
                              onClick={() => {
                                toggleUserStatus.mutate({
                                  userId: user.userId,
                                  isActive: !user.isActive,
                                });
                              }}
                              className={`px-3 py-1.5 text-[12px] font-semibold rounded-md border ${
                                user.isActive
                                  ? "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200"
                                  : "bg-green-500 text-white border-green-500 hover:bg-green-600"
                              }`}
                            >
                              {user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-200"
                            >
                              <Trash2 className="w-[18px] h-[18px] text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Detail Popup */}
      {showUserDetail && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-[640px] max-h-[90vh] overflow-y-auto relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-black">Chi tiết người dùng</h2>
              <button
                onClick={() => setShowUserDetail(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-7">
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-black mb-[6px]">
                    Tên người dùng
                  </label>
                  <div className="bg-[#e4f8ff] border border-[#09bcfd] rounded-md px-3 py-2">
                    <span className="text-black text-[14px]">{selectedUser.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-black mb-[6px]">
                    Email
                  </label>
                  <div className="bg-[#e4f8ff] border border-[#09bcfd] rounded-md px-3 py-2">
                    <span className="text-black text-[14px]">{selectedUser.email}</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Phone and Birthday */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-black mb-[6px]">
                    Số điện thoại
                  </label>
                  <div className="bg-[#e4f8ff] border border-[#09bcfd] rounded-md px-3 py-2">
                    <span className="text-black text-[14px]">
                      {selectedUser.phone || "0123456789"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-black mb-[6px]">
                    Ngày sinh
                  </label>
                  <div className="bg-[#e4f8ff] border border-[#09bcfd] rounded-md px-3 py-2">
                    <span className="text-black text-[14px]">
                      {selectedUser.dateOfBirth
                        ? new Date(selectedUser.dateOfBirth).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Gender, Role, Status */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-black mb-[6px]">
                    Giới tính
                  </label>
                  <div className="bg-[#e4f8ff] border border-[#09bcfd] rounded-md px-3 py-2">
                    <span className="text-black text-[14px]">{selectedUser.gender || "Nam"}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-black mb-[6px]">
                    Vai trò
                  </label>
                  <div className="bg-[#e4f8ff] border border-[#09bcfd] rounded-md px-3 py-2">
                    <span className="text-black text-[14px]">{selectedUser.role}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-black mb-[6px]">
                    Trạng thái
                  </label>
                  <div className="bg-[#e4f8ff] border border-[#09bcfd] rounded-md px-3 py-2">
                    <span className="text-black text-[14px]">
                      {selectedUser.isActive ? "Đang hoạt động" : "Bị vô hiệu"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[13px] font-semibold text-black mb-[6px]">
                  Địa chỉ
                </label>
                <div className="bg-[#e4f8ff] border border-[#09bcfd] rounded-md px-3 py-2">
                  <span className="text-black text-[14px]">
                    {selectedUser.address || "Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Xóa người dùng</h3>
              <p className="text-sm text-gray-500 mb-6">
                Bạn có chắc chắn muốn xóa người dùng "{userToDelete.name}"? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UsersScreen;
