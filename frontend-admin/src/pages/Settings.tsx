import avatarImg from "@/assets/beach-destination.jpg";
import { useEffect, useRef, useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import Layout from "@/components/Layout";
import { SlLocationPin } from "react-icons/sl";
import { IoGlobeOutline } from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";
import AdminAPI from "@/services/AdminAPI";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ProfileData = {
    name: string;
    phone: string;
    email: string;
};

export default function Settings() {
    const { user, token, updateUser } = useAuth();
    const [profile, setProfile] = useState<ProfileData>({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
    });
    const [avatarSrc, setAvatarSrc] = useState<string>(user?.profile_photo || avatarImg);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAvatarLoading, setIsAvatarLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    // Password change dialog state
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Load user profile on component mount
    useEffect(() => {
        if (!user && !token) {
            navigate('/login');
            return;
        }

        if (user) {
            setProfile({
                name: user?.name || "",
                phone: user?.phone || "",
                email: user?.email || "",
            });
            setAvatarSrc(user.profile_photo || avatarImg);
        }
    }, [user, token, navigate]);

    // Load fresh profile data
    const loadProfile = async () => {
        if (!token) return null;
        
        setIsProfileLoading(true);
        try {
            const response = await AdminAPI.getProfile(token);
            console.log('Profile response:', response); // Debug log
            
            if (response.success && response.data) {
                // Backend returns data directly as the user object
                const userData = response.data;
                console.log('User data:', userData); // Debug log
                
                setProfile({
                    name: userData?.name || "",
                    phone: userData?.phone || "",
                    email: userData?.email || "",
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
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
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
        if (!profile.name.trim()) {
            showToast('Tên người dùng không được để trống', 'error');
            return false;
        }

        if (profile.phone && !/^[+]?[0-9]{10,15}$/.test(profile.phone)) {
            showToast('Số điện thoại không hợp lệ (phải có 10-15 chữ số)', 'error');
            return false;
        }

        if (!profile.email.trim()) {
            showToast('Email không được để trống', 'error');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
            showToast('Email không hợp lệ', 'error');
            return false;
        }

        return true;
    };

    const handleUpdateProfile = async () => {
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

            // Check if email changed
            const emailChanged = profile.email !== (user?.email || '');
            
            // Clean and prepare data before sending
            const profileData: any = {
                name: profile.name?.trim() || '',
                phone: profile.phone?.trim() || '',
            };
            
            // If email changed, update it separately
            if (emailChanged) {
                const emailResponse = await AdminAPI.changeEmail(token, profile.email.trim());
                if (!emailResponse.success) {
                    showToast(emailResponse.message, 'error');
                    setIsLoading(false);
                    return;
                }
                showToast('Đổi email thành công. Vui lòng xác thực email mới.', 'success');
                // Reload profile to get updated email
                const updatedProfile = await loadProfile();
                if (updatedProfile && updateUser) {
                    updateUser(updatedProfile);
                }
            }

            // Remove empty strings
            Object.keys(profileData).forEach(key => {
                if (profileData[key as keyof typeof profileData] === '') {
                    delete profileData[key as keyof typeof profileData];
                }
            });

            // Update profile first if there are changes
            const profileResponse = await AdminAPI.updateProfile(token, profileData);
            
            if (!profileResponse.success) {
                showToast(profileResponse.message, 'error');
                setIsLoading(false);
                return;
            }
            profileUpdated = true;

            // Update avatar if selected
            if (selectedFile) {
                setIsAvatarLoading(true);
                const avatarResponse = await AdminAPI.updateAvatar(token, selectedFile);
                
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
            setProfile({
                name: user.name || "",
                phone: user.phone || "",
                email: user.email || "",
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
            profile.name !== (user.name || '') ||
            profile.phone !== (user.phone || '') ||
            profile.email !== (user.email || '');
        
        return hasFormChanges || selectedFile !== null;
    };

    const handleChangePassword = () => {
        setIsPasswordDialogOpen(true);
        setPasswordData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const validatePasswordForm = () => {
        if (!passwordData.oldPassword.trim()) {
            showToast('Vui lòng nhập mật khẩu cũ', 'error');
            return false;
        }

        if (!passwordData.newPassword.trim()) {
            showToast('Vui lòng nhập mật khẩu mới', 'error');
            return false;
        }

        if (passwordData.newPassword.length < 8) {
            showToast('Mật khẩu mới phải có ít nhất 8 ký tự', 'error');
            return false;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(passwordData.newPassword)) {
            showToast('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số', 'error');
            return false;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('Mật khẩu xác nhận không khớp', 'error');
            return false;
        }

        return true;
    };

    const handleSubmitPasswordChange = async () => {
        if (!token) {
            showToast('Vui lòng đăng nhập lại', 'error');
            return;
        }

        if (!validatePasswordForm()) {
            return;
        }

        setIsChangingPassword(true);
        
        try {
            const response = await AdminAPI.changePassword(
                token,
                passwordData.oldPassword,
                passwordData.newPassword
            );

            if (response.success) {
                showToast('Đổi mật khẩu thành công!', 'success');
                setIsPasswordDialogOpen(false);
                setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                showToast(response.message, 'error');
            }
        } catch (error) {
            console.error('Change password error:', error);
            showToast('Đổi mật khẩu thất bại', 'error');
        } finally {
            setIsChangingPassword(false);
        }
    };




    return (
        <Layout title="Cài đặt">
            <div className="min-h-screen bg-gray-50 p-4">
                <h1 className="text-[18px] font-bold text-gray-800 mb-6">Cài đặt</h1>
                
                {/* Loading state */}
                {isProfileLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-lg">Đang tải thông tin...</span>
                        </div>
                    </div>
                ) : (
                <div className="flex gap-6">
                    {/* Left Column - Introduction */}
                    <div className="flex-1 bg-white rounded-md shadow-sm p-5 w-[60%] border">
                        <div className="space-y-6">
                            <div>
                                <h2 className="font-semibold text-gray-700 mb-3">Giới thiệu</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Đây là một hệ thống quản lý du lịch toàn diện được thiết kế để
                                    hợp lý hóa việc quản lý và giám sát các hoạt động du lịch tại
                                    Thành phố Bacolod. Hệ thống cung cấp cho nhân viên quản lý tour
                                    du lịch những công cụ mạnh mẽ để quản lý tour du lịch, các điểm
                                    tham quan, theo dõi lượt khách và tạo ra các báo cáo chi tiết.
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Được xây dựng với các công nghệ web hiện đại, nền tảng này đảm
                                    bảo quản lý dữ liệu hiệu quả, giảm sát thời gian thực và điều
                                    phối liền mạch giữa các phòng ban du lịch khác nhau. Mục tiêu
                                    của chúng tôi là nâng cao trải nghiệm của du khách đồng thời
                                    cung cấp phương thông tin quý giá cho phát triển du lịch bền
                                    vững.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                                    Thông tin liên lạc
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 text-sm">
                                        <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <a
                                            href="mailto:tourism@bacolod.gov.ph"
                                            className="text-blue-600 hover:underline"
                                        >
                                            tourism@bacolod.gov.ph
                                        </a>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <Phone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">+63 34 433 2340</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <SlLocationPin className="w-5 h-5 text-green-600" />
                                        <span className="text-gray-700">
                                            Bacolod City Government Center, Bacolod City, Negros
                                            Occidental
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <IoGlobeOutline className="w-5 h-5 text-green-600" />
                                        <a
                                            href="https://www.bacolod.gov.ph"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            www.bacolod.gov.ph
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Form */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border">
                        <div className="flex items-center gap-2 mb-6">
                            <User className="w-6 h-6 text-gray-700" />
                            <h2 className="font-semibold text-gray-800">Cài đặt thông tin</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2 items-center">
                                <div className="flex items-center gap-6 border-gray-200">
                                    <div className="relative">
                                        <img 
                                            src={avatarSrc} 
                                            alt="avatar" 
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                        {isAvatarLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">
                                            Nhân viên quản trí tour
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {user?.email || ''}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isAvatarLoading}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Đổi ảnh đại diện
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
                            <div className="border-t border-gray-200"></div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:border-primary transition outline-none"
                                    />
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleInputChange}
                                    placeholder="Nhân viên quản trí tour"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleInputChange}
                                    placeholder="Nhập số điện thoại"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary transition"
                                />
                            </div>

                            {hasChanges() && (
                                <p className="text-xs text-amber-600">
                                    • Có thay đổi chưa lưu
                                </p>
                            )}

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading || !hasChanges()}
                                    className="flex-1 bg-primary text-white font-medium hover:bg-primary/70 py-2 rounded-md transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        'Cập nhật thông tin'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isLoading || !hasChanges()}
                                    className="px-4 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Hủy
                                </button>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Lock className="w-5 h-5 text-gray-700" />
                                    <h3 className="text-lg font-semibold text-gray-800">Bảo mật</h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleChangePassword}
                                    className="w-full bg-primary hover:bg-primary/70 text-white font-medium py-2 rounded-md transition duration-200 shadow-sm"
                                >
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* Change Password Dialog */}
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Đổi mật khẩu</DialogTitle>
                            <DialogDescription>
                                Vui lòng nhập mật khẩu cũ và mật khẩu mới của bạn
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu cũ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:border-primary transition outline-none"
                                        placeholder="Nhập mật khẩu cũ"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu mới <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:border-primary transition outline-none"
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:border-primary transition outline-none"
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsPasswordDialogOpen(false)}
                                disabled={isChangingPassword}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmitPasswordChange}
                                disabled={isChangingPassword}
                                className="bg-primary hover:bg-primary/70"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Đổi mật khẩu'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}

