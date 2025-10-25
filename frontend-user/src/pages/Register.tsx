import logo from "@/assets/logo.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [tab, setTab] = useState<"login" | "register">("register");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

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
                className={`absolute top-1 bottom-1 w-1/2 bg-primary rounded-full transition-all duration-300 ${
                  tab === "login" ? "left-1" : "left-1/2"
                }`}
              ></div>

              <button
                onClick={() => {
                  setTab("login");
                  navigate("/login");
                }}
                className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-full transition-colors duration-300 ${
                  tab === "login" ? "text-white" : "text-slate-600"
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  setTab("register");
                  navigate("/register");
                }}
                className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-full transition-colors duration-300 ${
                  tab === "register" ? "text-white" : "text-slate-600"
                }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Form */}
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Tên người dùng
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-4 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập tên người dùng"
            />

            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập email"
            />

            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập mật khẩu"
            />

            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mb-4 rounded-full border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập lại mật khẩu"
            />

            {/* Nút đăng ký */}
            <button className="w-full rounded-full bg-primary text-white py-2 font-medium">
              Đăng ký
            </button>

            {/* Hoặc */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <div className="text-xs text-slate-400">Hoặc đăng ký bằng</div>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google login */}
            <button className="w-full rounded-full border border-border py-2 bg-white flex items-center justify-center gap-2">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="google"
                className="h-4"
              />
              Tiếp tục với Google
            </button>

            <p className="text-center text-sm text-slate-500 mt-6">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="text-primary underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
