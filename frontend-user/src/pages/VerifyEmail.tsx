import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import logo from "@/assets/logo.png";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyEmail } = useAuth();
    const { showToast } = useToast();
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            showToast('Token xác thực không hợp lệ', 'error');
            navigate('/login');
            return;
        }

        // Only run once when component mounts
        if (verificationStatus !== 'pending') {
            return;
        }

        const handleVerification = async () => {
            setIsVerifying(true);
            try {
                const result = await verifyEmail(token);

                if (result.success) {
                    setVerificationStatus('success');
                    showToast('Email đã được xác thực thành công!', 'success');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setVerificationStatus('error');
                    showToast(result.message, 'error');
                }
            } catch (error) {
                setVerificationStatus('error');
                showToast('Xác thực email thất bại', 'error');
            } finally {
                setIsVerifying(false);
            }
        };

        handleVerification();
    }, [token]); // Only depend on token

    return (
        <div className="relative min-h-screen bg-[url('/src/assets/hero-vietnam.jpg')] bg-cover bg-center flex items-center justify-center">
            <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-primary/70 via-primary/50 to-transparent" />

            <div className="w-full max-w-lg p-6 mx-auto">
                <div className="relative z-10 bg-white/90 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-8 text-center">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <img src={logo} alt="Venture" className="h-12" />
                        </div>

                        {/* Verification Status */}
                        {isVerifying && (
                            <div className="space-y-4">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                                <h2 className="text-xl font-semibold text-gray-800">Đang xác thực email...</h2>
                                <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
                            </div>
                        )}

                        {verificationStatus === 'success' && (
                            <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Xác thực thành công!</h2>
                                <p className="text-gray-600">Email của bạn đã được xác thực. Bạn sẽ được chuyển đến trang đăng nhập trong vài giây.</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                                >
                                    Đăng nhập ngay
                                </button>
                            </div>
                        )}

                        {verificationStatus === 'error' && (
                            <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Xác thực thất bại</h2>
                                <p className="text-gray-600">Token xác thực không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại.</p>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="w-full px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                                    >
                                        Đăng ký lại
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        Quay lại đăng nhập
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
