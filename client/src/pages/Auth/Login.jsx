import { Link, useNavigate } from "react-router";
import loginImg from "../../assets/login-img.jpg";
import AuthButton from "../../components/Auth/AuthButton";
import AuthSelect from "../../components/Auth/AuthSelect";
import Input from "../../components/UI/Input";
import { useState } from "react";
import axios from "../../common";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-white">
      <div className="flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-100">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-full flex items-center">
              <button className="bg-white text-gray-900 shadow-sm px-6 py-1.5 rounded-full text-sm font-semibold transition-all">
                Đăng nhập
              </button>
              <Link
                to="/register"
                className="text-gray-500 hover:text-gray-900 px-6 py-1.5 rounded-full text-sm font-medium transition-all"
              >
                Đăng ký
              </Link>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Xin chào</h1>
            <p className="text-gray-500 text-sm">
              Vui lòng nhập thông tin của bạn để đăng nhập
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Mật khẩu
                </label>
                <Link
                  to="/forgotpassword"
                  className="text-xs text-gray-500 hover:text-gray-900 font-medium"
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
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-gray-400">Hoặc</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <AuthSelect
              icon="https://www.svgrepo.com/show/475656/google-color.svg"
              text="Tiếp tục với Google"
            />

            <AuthSelect
              icon="https://www.svgrepo.com/show/511330/apple-173.svg"
              text="Tiếp tục với Apple"
            />

            <AuthSelect
              icon="https://www.svgrepo.com/show/473558/binance.svg"
              text="Tiếp tục với Binance"
            />
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-gray-900 font-bold hover:underline"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block p-2">
        <div className="h-full w-full rounded-2xl overflow-hidden relative">
          <img
            src={loginImg}
            alt="Login Banner"
            className="h-full w-full object-cover object-right"
          />

          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>

          <div className="absolute bottom-10 left-6 right-6 text-white z-10">
            <h3 className="text-3xl font-bold mb-2 drop-shadow-md">UITShare</h3>
            <p className="text-gray-200 text-sm leading-relaxed drop-shadow-sm">
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
