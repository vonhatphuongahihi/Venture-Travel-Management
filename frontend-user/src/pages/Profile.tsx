import avatarImg from "@/assets/beach-destination.jpg";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import UserAPI from "@/services/userAPI";
import { Camera, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, token, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>(user?.profile_photo || avatarImg);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    date_of_birth: user?.date_of_birth || '',
    gender: user?.gender || ''
  });
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load user profile on component mount
  useEffect(() => {
    if (!user && !token) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || ''
      });
      setAvatarSrc(user.profile_photo || avatarImg);
    }
  }, [user, token, navigate]);

  // Load fresh profile data
  const loadProfile = async () => {
    if (!token) return null;
    
    setIsProfileLoading(true);
    try {
      const response = await UserAPI.getProfile(token);
      console.log('Profile response:', response); // Debug log
      
      if (response.success && response.data) {
        // Backend returns data directly as the user object
        const userData = response.data;
        console.log('User data:', userData); // Debug log
        
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          address: userData.address || '',
          date_of_birth: userData.date_of_birth || '',
          gender: userData.gender || ''
        });
        setAvatarSrc(userData.profile_photo || avatarImg);
        return userData; // Return the user data
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsProfileLoading(false);
    }
    return null;
  };  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn file ảnh', 'error');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB', 'error');
        return;
      }

      setSelectedFile(file);
      setAvatarSrc(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Tên người dùng không được để trống', 'error');
      return false;
    }

    if (formData.phone && !/^[+]?[0-9]{10,15}$/.test(formData.phone)) {
      showToast('Số điện thoại không hợp lệ (phải có 10-15 chữ số)', 'error');
      return false;
    }

    return true;
  };

  const handleSaveChanges = async () => {
    if (!token) {
      showToast('Vui lòng đăng nhập lại', 'error');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      let profileUpdated = false;
      let avatarUpdated = false;

      // Clean and prepare data before sending
      const profileData = {
        name: formData.name?.trim() || '',
        phone: formData.phone?.trim() || '',
        address: formData.address?.trim() || '',
        gender: formData.gender?.trim() || '',
        date_of_birth: formData.date_of_birth?.trim() || ''
      };

      // Remove empty strings
      Object.keys(profileData).forEach(key => {
        if (profileData[key as keyof typeof profileData] === '') {
          delete profileData[key as keyof typeof profileData];
        }
      });

      // Update profile first if there are changes
      const profileResponse = await UserAPI.updateProfile(token, profileData);
      
      if (!profileResponse.success) {
        showToast(profileResponse.message, 'error');
        setIsLoading(false);
        return;
      }
      profileUpdated = true;

      // Update avatar if selected
      if (selectedFile) {
        setIsAvatarLoading(true);
        const avatarResponse = await UserAPI.updateAvatar(token, selectedFile);
        
        if (!avatarResponse.success) {
          showToast(avatarResponse.message, 'error');
        } else {
          avatarUpdated = true;
          setSelectedFile(null);
        }
        setIsAvatarLoading(false);
      }

      // Show success message
      if (profileUpdated && avatarUpdated) {
        showToast('Cập nhật thông tin và ảnh đại diện thành công!', 'success');
      } else if (profileUpdated) {
        showToast('Cập nhật thông tin thành công!', 'success');
      } else if (avatarUpdated) {
        showToast('Cập nhật ảnh đại diện thành công!', 'success');
      }
      
      // Reload profile data to sync with server
      const updatedProfile = await loadProfile();
      
      // Update user context if profile was reloaded successfully
      if (updatedProfile && updateUser) {
        updateUser(updatedProfile);
      }
      
    } catch (error) {
      console.error('Save changes error:', error);
      showToast('Cập nhật thông tin thất bại', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || ''
      });
      
      // Reset avatar
      setAvatarSrc(user.profile_photo || avatarImg);
    }
    
    setSelectedFile(null);
    showToast('Đã hủy thay đổi', 'info');
  };

  const hasChanges = () => {
    if (!user) return false;
    
    const hasFormChanges = 
      formData.name !== (user.name || '') ||
      formData.phone !== (user.phone || '') ||
      formData.address !== (user.address || '') ||
      formData.date_of_birth !== (user.date_of_birth || '') ||
      formData.gender !== (user.gender || '');
    
    return hasFormChanges || selectedFile !== null;
  };

  const handleLogout = () => {
    logout();
    showToast('Đã đăng xuất thành công', 'success');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
       <div className="text-center mt-8 md:mt-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Thông tin <span className="text-gradient">Tài khoản</span>
          </h2>
        </div>

      {/* Loading state */}
      {isProfileLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg">Đang tải thông tin...</span>
          </div>
        </div>
      ) : (
      <main className="container py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-white/80 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6 mt-6">
              <img src={user?.profile_photo || avatarImg} alt="avatar" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <div className="text-m font-medium">{user?.name || 'Người dùng'}</div>
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
              <button 
                onClick={handleLogout}
                className="w-full text-l text-red-500 text-center py-2 px-3 rounded-md mt-12 bg-red-50 text-red-600 transform transition-transform duration-500 hover:scale-105 hover:bg-red-500 hover:text-white"
              >
                Đăng xuất
              </button>
            </div>
          </aside>

          {/* Main card */}
          <section className="flex-1">
            <div className="bg-white/90 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 p-8">
              <h2 className="text-lg font-medium mb-3">Hồ sơ của tôi</h2>
              <p className="text-sm text-slate-600 mb-6">
                Quản lý thông tin hồ sơ để bảo mật tài khoản
                {hasChanges() && (
                  <span className="ml-2 text-amber-600 text-xs">
                    • Có thay đổi chưa lưu
                  </span>
                )}
              </p>

              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="text-center relative">
                    {/* Avatar with camera overlay */}
                    <div className="relative inline-block">
                      <img src={avatarSrc} alt="avatar" className="h-28 w-28 mb-6 rounded-full object-cover mx-auto block" />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAvatarLoading}
                        className="absolute -right-1 -bottom-1 text-primary p-2 rounded-full hover:scale-110 transform transition disabled:opacity-50"
                        aria-label="Cập nhật ảnh đại diện"
                        title="Cập nhật ảnh đại diện"
                      >
                        {isAvatarLoading ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onAvatarChange}
                        className="hidden"
                      />
                    </div>
                    {selectedFile && (
                      <p className="text-xs text-primary mt-2">Ảnh mới được chọn: {selectedFile.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Tên người dùng: <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Email:</label>
                    <input
                      className="w-full rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                      value={user?.email || ''}
                      disabled
                      aria-disabled="true"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Số điện thoại:</label>
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      className="w-full rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition" 
                    />
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

                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Ngày sinh:</label>
                    <input
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth ? formData.date_of_birth.split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Giới tính:</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-slate-600 mb-1">Địa chỉ:</label>
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ đầy đủ"
                    className="w-full rounded-md border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition" 
                  />
                </div>

                <div className="mt-6 flex justify-center gap-8">
                  <button 
                    onClick={handleSaveChanges}
                    disabled={isLoading || !hasChanges()}
                    className="bg-primary text-white rounded-full px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu thay đổi'
                    )}
                  </button>
                  <button 
                    onClick={handleCancel}
                    disabled={isLoading || !hasChanges()}
                    className="border border-primary/50 text-sm text-slate-600 rounded-full px-6 py-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
