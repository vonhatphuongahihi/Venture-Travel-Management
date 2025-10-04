import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import avatarImg from "@/assets/beach-destination.jpg";
import { useState, useRef } from "react";
import { Eye, EyeOff, Camera } from "lucide-react";

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>(avatarImg);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAvatarSrc(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
       <div className="text-center mt-8 md:mt-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Thông tin <span className="text-gradient">Tài khoản</span>
          </h2>
        </div>

      <main className="container py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-white/80 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6 mt-6">
              <img src={avatarImg} alt="avatar" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <div className="text-m font-medium">Lê Thiên Phúc</div>
                <div className="text-xs text-slate-600">Thành viên</div>
              </div>
            </div>

            <nav className="space-y-2">
              <Link to="#" className="block text-m  py-2 px-3 rounded-md border text-primary border border-primary/50">Hồ sơ của tôi</Link>
              <Link to="#" className="block text-m text-slate-600 py-2 px-3 rounded-md hover:bg-primary/10">Thông báo</Link>
              <Link to="#" className="block text-m text-slate-600 py-2 px-3 rounded-md hover:bg-primary/10">Lịch sử đặt tour</Link>
              <Link to="#" className="block text-m text-slate-600 py-2 px-3 rounded-md hover:bg-primary/10">Cài đặt</Link>
            </nav>

            <div className="mt-6 border-t border-border pt-4">
              <button className="w-full text-m text-slate-600 text-left py-2 px-3 rounded-md hover:bg-primary/10">Điều khoản sử dụng</button>
              <button className="w-full text-m mt-3 text-slate-600 text-left py-2 px-3 rounded-md hover:bg-primary/10">Chính sách bảo mật</button>
              <button className="w-full text-m mt-3 text-slate-600 text-left py-2 px-3 rounded-md hover:bg-primary/10">Về VENTURE</button>
              <button className="w-full text-l text-red-500 text-center py-2 px-3 rounded-md mt-12 bg-red-50 text-red-600 transform transition-transform duration-500 hover:scale-105 hover:bg-red-500 hover:text-white">Đăng xuất</button>
            </div>
          </aside>

          {/* Main card */}
          <section className="flex-1">
            <div className="bg-white/90 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 p-8">
              <h2 className="text-lg font-medium mb-3">Hồ sơ của tôi</h2>
              <p className="text-sm text-slate-600 mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="text-center relative">
                    {/* Avatar with camera overlay */}
                    <div className="relative inline-block">
                      <img src={avatarSrc} alt="avatar" className="h-28 w-28 mb-6 rounded-full object-cover mx-auto block" />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -right-1 -bottom-1 text-primary p-2 rounded-full hover:scale-110 transform transition"
                        aria-label="Cập nhật ảnh đại diện"
                        title="Cập nhật ảnh đại diện"
                      >
                        <Camera className="h-4 w-4" />
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onAvatarChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Tên người dùng:</label>
                    <input className="w-full rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition" defaultValue="22521121@gm.uit.edu.vn" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Email:</label>
                    <input
                      className="w-full rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                      defaultValue="22521121@gm.uit.edu.vn"
                      disabled
                      aria-disabled="true"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Số điện thoại:</label>
                    <input className="w-full rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition" defaultValue="0909090909" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Mật khẩu:</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full rounded-md border border-primary/50 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition"
                        defaultValue="password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary"
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-slate-600 mb-1">Địa chỉ</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input className="rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Tỉnh/Thành phố" />
                    <input className="rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Phường/Xã" />
                    <input className="rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Số nhà, tên đường" />    
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-8">
                  <button className="bg-primary text-white rounded-full px-6 py-2">Lưu thay đổi</button>
                  <button className="border border-primary/50 text-sm text-slate-600 rounded-full px-6 py-2">Hủy</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
