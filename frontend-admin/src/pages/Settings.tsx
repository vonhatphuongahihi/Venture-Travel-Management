
import { useRef, useState } from "react";
import { User, Mail, Phone, Lock } from "lucide-react";
import Layout from "@/components/Layout";
import { SlLocationPin } from "react-icons/sl";
import { IoGlobeOutline } from "react-icons/io5";
type ProfileData = {
    role: string;
    email: string;
    name: string;
    phone: string;
    avatar: string;
};

export default function Settings() {
    const [profile, setProfile] = useState<ProfileData>({
        role: "Nhân viên quản trí tour",
        email: "admin@venture.com",
        name: "",
        phone: "0983 0983 888",
        avatar: "",
    });

    const getInitials = (email: string) => {
        return email.substring(0, 2).toUpperCase();
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdateProfile = () => {};

    const handleChangePassword = () => {
        console.log("Change password clicked");
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Layout title="Cài đặt">
            <div className="min-h-screen bg-gray-50 p-4">
                <h1 className="text-[18px] font-bold text-gray-800 mb-6">Cài đặt</h1>
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
                                    <div
                                        className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center text-2xl font-semibold text-cyan-700 overflow-hidden cursor-pointer flex-shrink-0"
                                        onClick={handleAvatarClick}
                                    >
                                        {profile.avatar ? (
                                            <img
                                                src={profile.avatar}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            getInitials(profile.email)
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">
                                            {profile.role}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {profile.email}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleAvatarClick}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            Đổi ảnh đại diện
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200"></div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:border-primary transition"
                                    />
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
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
                                    value={profile.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary transition"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleUpdateProfile}
                                className="w-full bg-primary text-white font-medium hover:bg-primary/70 py-2 rounded-md transition duration-200 shadow-sm"
                            >
                                Cập nhật thông tin
                            </button>

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
            </div>
        </Layout>
    );
}

