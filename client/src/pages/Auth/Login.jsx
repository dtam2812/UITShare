import { Link, useNavigate } from "react-router";
import loginImg from "../../assets/login-img.jpg";
import AuthButton from "../../components/Auth/AuthButton";
import Input from "../../components/UI/Input";
import { useState } from "react";
import axios from "../../common";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../../context/CartContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { reloadCartForCurrentUser } = useCart();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Chưa nhập đủ thông tin!");
        return;
      }

      const response = await axios.post("api/auth/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        const payloadDedoded = jwtDecode(accessToken);

        if (payloadDedoded.role === "admin") navigate("/admin");
        else navigate("/");

        localStorage.setItem("access_token", accessToken);
        reloadCartForCurrentUser();
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative grid h-screen grid-cols-1 bg-transparent text-white md:grid-cols-2">
      <div className="absolute top-6 left-6 z-50 md:top-8 md:left-8">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img
            src="/UIT-Share-Logo-2.svg"
            alt="UITShare Logo"
            className="h-8 object-contain md:h-10"
          />
        </Link>
      </div>

      <div className="z-10 flex flex-col items-center justify-center overflow-y-auto p-6 md:p-12">
        <div className="w-full max-w-100">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md">
              <button className="rounded-full bg-purple-600 px-6 py-1.5 text-sm font-semibold text-white shadow-sm transition-all">
                Đăng nhập
              </button>
              <Link
                to="/register"
                className="rounded-full px-6 py-1.5 text-sm font-medium text-gray-400 transition-all hover:text-purple-300"
              >
                Đăng ký
              </Link>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">Xin chào</h1>
            <p className="text-sm text-gray-400">
              Vui lòng nhập thông tin của bạn để đăng nhập
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-300">
                Địa chỉ email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-300">
                  Mật khẩu
                </label>
                <Link
                  to="/forgotpassword"
                  className="text-xs font-medium text-gray-400 transition-colors hover:text-purple-400"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <AuthButton>Đăng nhập</AuthButton>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#050816] px-2 text-gray-400">Hoặc</span>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-bold text-purple-400 transition-colors hover:text-purple-300 hover:underline"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden p-2 md:block">
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10">
          <img
            src={loginImg}
            alt="Login Banner"
            className="h-full w-full object-cover object-right opacity-80"
          />

          <div className="absolute right-0 bottom-0 left-0 h-3/4 bg-linear-to-t from-[#050816] via-[#050816]/70 to-transparent"></div>

          <div className="absolute right-6 bottom-10 left-6 z-10 text-white">
            <h3 className="mb-2 bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent drop-shadow-md">
              UITShare
            </h3>
            <p className="text-sm leading-relaxed text-gray-300 drop-shadow-sm">
              Nền tảng chia sẻ tài liệu số 1 dành cho sinh viên UIT.
              <br />
              Học tập hiệu quả, chia sẻ đam mê.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
