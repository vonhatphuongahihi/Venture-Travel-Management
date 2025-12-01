import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserSidebar from "@/components/UserSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import UserAPI from "@/services/userAPI";
import doiMatKhauImg from "@/assets/doi-mat-khau.png";
import vietnamFlag from "@/assets/vitenam-flag.png";
import ukFlag from "@/assets/uk-flag.png";

const Settings = () => {
  const { user, token, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Language state
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("language") || "vi";
  });
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Delete account state
  const [deleteUsername, setDeleteUsername] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    showToast("Đã đăng xuất thành công", "success");
    navigate("/login");
  };

  // Change Password Handler
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      showToast("Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }

    if (newPassword.length < 8) {
      showToast("Mật khẩu mới phải có ít nhất 8 ký tự", "error");
      return;
    }

    if (!token) {
      showToast("Vui lòng đăng nhập lại", "error");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await UserAPI.changePassword(token, currentPassword, newPassword);

      if (response.success) {
        showToast("Đổi mật khẩu thành công!", "success");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        showToast(response.message || "Đổi mật khẩu thất bại", "error");
      }
    } catch (error) {
      console.error("Change password error:", error);
      showToast("Không thể kết nối đến server. Vui lòng thử lại.", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Change Language Handler
  const handleChangeLanguage = async () => {
    setIsChangingLanguage(true);

    // Simulate API call (you can add real API later)
    setTimeout(() => {
      localStorage.setItem("language", language);
      showToast("Đổi ngôn ngữ thành công!", "success");
      setIsChangingLanguage(false);
      // Reload page to apply language change
      window.location.reload();
    }, 500);
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    if (!deleteUsername || deleteUsername !== user?.name) {
      showToast("Tên người dùng không khớp", "error");
      return;
    }

    if (!token) {
      showToast("Vui lòng đăng nhập lại", "error");
      return;
    }

    setIsDeletingAccount(true);

    try {
      const response = await UserAPI.deleteAccount(token, user.userId);

      if (response.success) {
        showToast("Tài khoản đã được xóa thành công", "success");
        logout();
        navigate("/login");
      } else {
        showToast(response.message || "Xóa tài khoản thất bại", "error");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      showToast("Không thể kết nối đến server. Vui lòng thử lại.", "error");
    } finally {
      setIsDeletingAccount(false);
      setDeleteUsername("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="text-center mt-8 md:mt-12 mb-8 md:mb-12 px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Cài Đặt <span className="text-gradient">Tài Khoản</span>
        </h2>
      </div>

      <main className="container mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <UserSidebar
            user={user}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
            activeLink="settings"
          />

          {/* Main Content */}
          <section className="flex-1 min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6">
              {/* Change Password Card */}
              <Card className="p-6 h-fit">
                <CardTitle className="mb-4 text-lg">Đổi mật khẩu</CardTitle>

                {/* Image - smaller size */}
                <div className="flex justify-center mb-6">
                  <img
                    src={doiMatKhauImg}
                    alt="Đổi mật khẩu"
                    className="w-full max-w-[200px] h-auto object-contain"
                  />
                </div>

                {/* Form - narrower container */}
                <div className="max-w-2xl mx-auto space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-left block">
                      Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="text-left block">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-left">
                      Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                    </p>
                  </div>

                  {/* Button centered */}
                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword || !currentPassword || !newPassword}
                      className="w-auto px-8"
                    >
                      {isChangingPassword ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Language Settings Card */}
              <Card className="p-6 h-fit">
                <CardTitle className="mb-6 text-lg">Cài đặt ngôn ngữ</CardTitle>

                {/* Form - narrower container */}
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="radio"
                        name="language"
                        value="vi"
                        checked={language === "vi"}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-5 h-5 text-primary"
                      />
                      <div className="flex items-center gap-2">
                        <img src={vietnamFlag} alt="Vietnam Flag" className="w-6 h-6 rounded-sm" />
                        <span className="font-medium">Tiếng Việt</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="radio"
                        name="language"
                        value="en"
                        checked={language === "en"}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-5 h-5 text-primary"
                      />
                      <div className="flex items-center gap-2">
                        <img src={ukFlag} alt="UK Flag" className="w-6 h-6 rounded-sm" />
                        <span className="font-medium">English</span>
                      </div>
                    </label>
                  </div>

                  {/* Button centered */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleChangeLanguage}
                      disabled={isChangingLanguage}
                      className="w-auto px-8"
                    >
                      {isChangingLanguage ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Delete Account Card */}
              <Card className="p-6 h-fit">
                <CardTitle className="mb-4 text-lg">Xoá tài khoản</CardTitle>

                {/* Form - narrower container */}
                <div className="max-w-2xl mx-auto space-y-6">
                  <p className="text-sm text-red-700">
                    Bạn có chắc chắn muốn xoá tài khoản này? Hành động này không thể hoàn tác.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="deleteUsername" className="whitespace-nowrap min-w-fit">
                        Nhập tên người dùng
                      </Label>
                      <Input
                        id="deleteUsername"
                        type="text"
                        placeholder=""
                        value={deleteUsername}
                        onChange={(e) => setDeleteUsername(e.target.value)}
                        className="flex-1"
                      />
                    </div>

                    <div className="flex justify-center pt-2">
                      <Button
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount || deleteUsername !== user?.name}
                        className="w-auto px-8 bg-cyan-400 hover:bg-cyan-500 text-white"
                      >
                        {isDeletingAccount ? "Đang xử lý..." : "Xoá tài khoản"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;

