import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"login" | "register">("register");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { register, loginWithGoogle, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirm) {
      showToast(t('auth.register.fillAllFields'), 'error');
      return;
    }

    if (password !== confirm) {
      showToast(t('auth.register.passwordMismatch'), 'error');
      return;
    }

    if (password.length < 8) {
      showToast(t('auth.register.passwordMinLength'), 'error');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      showToast(t('auth.register.passwordRequirements'), 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        name: username,
        email,
        password,
      });

      if (result.success) {
        showToast(t('auth.register.success'), 'success');
        navigate('/login');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Đăng ký thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    loginWithGoogle();
    // Note: loginWithGoogle redirects, so we won't reset this state
    // but it's fine as the page will navigate away
  };

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/hero-vietnam.jpg')] bg-cover bg-center flex items-center justify-center md:justify-end">
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-primary/70 via-primary/50 to-transparent" />

      <div className="w-full max-w-lg p-6 mx-auto md:mr-16">
        <div className="relative z-10 bg-white/90 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Venture" className="h-12" />
            </div>

            {/* Tabs */}
            <div className="relative bg-slate-100 rounded-full flex p-1 mb-6">
              {/* Highlight xanh */}
              <div
                className={`absolute top-1 bottom-1 w-1/2 bg-primary rounded-full transition-all duration-300 ${tab === "login" ? "left-1" : "left-1/2"
                  }`}
              ></div>

              <button
                onClick={() => {
                  setTab("login");
                  navigate("/login");
                }}
                className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-full transition-colors duration-300 ${tab === "login" ? "text-white" : "text-slate-600"
                  }`}
              >
                {t('auth.login.title')}
              </button>
              <button
                onClick={() => {
                  setTab("register");
                  navigate("/register");
                }}
                className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-full transition-colors duration-300 ${tab === "register" ? "text-white" : "text-slate-600"
                  }`}
              >
                {t('auth.register.title')}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister}>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t('auth.register.username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mb-4 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('auth.register.usernamePlaceholder')}
                required
              />

              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t('auth.register.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('auth.register.emailPlaceholder')}
                required
              />

              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t('auth.register.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('auth.register.passwordPlaceholder')}
                required
                minLength={8}
              />

              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t('auth.register.confirmPassword')}
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full mb-4 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                required
              />

              {/* Nút đăng ký */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-primary text-white py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('auth.register.registering') : t('auth.register.registerButton')}
              </button>
            </form>

            {/* Hoặc */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <div className="text-xs text-slate-400">{t('auth.register.orRegisterWith')}</div>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full rounded-full border border-border py-2 bg-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="google"
                className="h-4"
              />
              {isGoogleLoading ? t('auth.register.processing') : t('auth.register.continueWithGoogle')}
            </button>

            <p className="text-center text-sm text-slate-500 mt-6">
              {t('auth.register.hasAccount')}{" "}
              <Link to="/login" className="text-primary underline">
                {t('auth.register.loginLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
