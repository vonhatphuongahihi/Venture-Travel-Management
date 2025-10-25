import React from "react";
import logo from "../assets/logo.png";

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 border-2 border-sky-400 rounded-md bg-white shadow-sm text-center">
        {/* Logo */}
        <img src={logo} alt="Venture Logo" className="mx-auto mb-4 w-40" />
        <p className="text-md text-[#26B8ED] mb-6">
          Đăng nhập vào hệ thống quản trị
        </p>

        {/* Form */}
        <form className="text-left">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-bold text-[#11BBF3]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Nhập email của bạn"
                className="w-full px-3 py-2 border rounded-lg border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-bold text-[#11BBF3]"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu của bạn"
                className="w-full px-3 py-2 border rounded-lg border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-[#11BBF3] rounded-lg hover:bg-[#0A99C1] transition mt-8"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;