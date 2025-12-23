import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import UserAPI from '@/services/userAPI';

const GoogleAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Save token and get user profile
            handleGoogleLoginSuccess(token);
        } else {
            showToast('Không nhận được token từ Google', 'error');
            setTimeout(() => navigate('/login'), 2000);
        }
    }, []);

    const handleGoogleLoginSuccess = async (token: string) => {
        try {
            // Get user profile with token using UserAPI
            const response = await UserAPI.getProfile(token);

            if (response.success && response.data) {
                // Set user and token in storage
                localStorage.setItem('token', token);
                localStorage.setItem('remember', 'true');
                localStorage.setItem('user', JSON.stringify(response.data));

                // Force page reload to update header with new user data
                showToast('Đăng nhập Google thành công!', 'success');
                // Use replace instead of href to avoid adding to history
                setTimeout(() => {
                    window.location.replace('/');
                }, 500);
            } else {
                showToast(response.message || 'Không thể lấy thông tin người dùng', 'error');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            console.error('Google auth success error:', error);
            showToast('Đăng nhập Google thất bại', 'error');
            setTimeout(() => navigate('/login'), 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Đang xử lý đăng nhập Google...</h2>
                <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
            </div>
        </div>
    );
};

export default GoogleAuthSuccess;
