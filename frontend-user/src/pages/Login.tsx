import React from "react";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuthAPI from "@/services/authAPI";

const Login = () => {
  const { state } = useLocation();
  const { t } = useTranslation();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (state?.redirectLink && isAuthenticated) {
      navigate(state?.redirectLink)
      return;
    }
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showToast(t('auth.login.fillAllFields'), 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password, remember);

      if (result.success) {
        showToast(t('auth.login.success'), 'success');
        if (state?.redirectLink) {
          navigate(state?.redirectLink)
          return;
        }
        navigate('/');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Đăng nhập thất bại. Vui lòng thử lại.', 'error');
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail) {
      showToast(t('auth.forgotPassword.emailRequired'), 'error');
      return;
    }

    setIsForgotLoading(true);
    try {
      const result = await AuthAPI.forgotPassword(forgotEmail);

      if (result.success) {
        showToast(t('auth.forgotPassword.success'), 'success');
        setIsForgotOpen(false);
        setForgotEmail("");
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/hero-vietnam.jpg')] bg-cover bg-center flex items-center justify-center md:items-start md:justify-end">
      {/* gradient overlay like HeroSection */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-primary/70 via-primary/50 to-transparent" />

      <div className="w-full max-w-lg p-6 mx-auto md:mr-16 md:mt-24">
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

            <form onSubmit={handleLogin}>
              {/* Email */}
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t('auth.login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('auth.login.emailPlaceholder')}
                required
              />

              {/* Mật khẩu */}
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t('auth.login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-2 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('auth.login.passwordPlaceholder')}
                required
              />

              {/* Ghi nhớ + Quên mật khẩu */}
              <div className="flex items-center justify-between text-sm mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t('auth.login.rememberMe')}</span>
                </label>
                <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
                  <DialogTrigger asChild>
                    <button className="text-sm text-primary underline hover:text-primary/80">
                      {t('auth.login.forgotPassword')}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{t('auth.forgotPassword.title')}</DialogTitle>
                      <DialogDescription>
                        {t('auth.forgotPassword.description')}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          {t('auth.login.email')}
                        </label>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder={t('auth.login.emailPlaceholder')}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isForgotLoading}
                        className="w-full rounded-full bg-primary text-white py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isForgotLoading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendResetLink')}
                      </button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Nút đăng nhập */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-primary text-white py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('auth.login.loggingIn') : t('auth.login.loginButton')}
              </button>
            </form>

            {/* Hoặc */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <div className="text-xs text-slate-400">{t('auth.login.orLoginWith')}</div>
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
              {isGoogleLoading ? t('auth.login.loggingIn') : t('auth.login.continueWithGoogle')}
            </button>

            {/* Link đăng ký */}
            <p className="text-center text-sm text-slate-500 mt-6">
              {t('auth.login.noAccount')}{" "}
              <Link to="/register" className="text-primary underline">
                {t('auth.login.registerNow')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
