import { Link } from "react-router";
import loginImg from "../../assets/login-img.jpg";
import AuthButton from "../../components/Auth/AuthButton";
import AuthSelect from "../../components/Auth/AuthSelect";
import Input from "../../components/UI/Input";
import { useState } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!userName || !email || !password || !confirmPassword) {
      alert("Chưa nhập đủ thông tin");
      return;
    }

    if (password.length < 6) {
      setErrorPassword("Mật khẩu ít hơn 6 ký tự!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorConfirm("Mật khẩu xác nhận không đúng!");
      return;
    }

    axios
      .post("http://localhost:5000/api/auth/register", {
        userName: userName,
        email: email,
        password: password,
      })
      .then(() => {})
      .catch((error) => console.log(error));

    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-white">
      <div className="hidden md:block p-2">
        <div className="h-full w-full rounded-2xl overflow-hidden relative">
          <img
            src={loginImg}
            alt="Register Banner"
            className="h-full w-full object-cover object-right"
          />

          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>

          <div className="absolute bottom-10 left-6 right-6 text-white z-10">
            <h3 className="text-3xl font-bold mb-2 drop-shadow-md">UITShare</h3>
            <p className="text-gray-200 text-sm leading-relaxed drop-shadow-sm">
              Tham gia cộng đồng chia sẻ tài liệu lớn nhất UIT.
              <br />
              Bảo mật và minh bạch với công nghệ Blockchain.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-100">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-full flex items-center">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-900 px-6 py-1.5 rounded-full text-sm font-medium transition-all"
              >
                Đăng nhập
              </Link>
              <button className="bg-white text-gray-900 shadow-sm px-6 py-1.5 rounded-full text-sm font-semibold transition-all">
                Đăng ký
              </button>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tạo tài khoản
            </h1>
            <p className="text-gray-500 text-sm">
              Bắt đầu hành trình chia sẻ tri thức của bạn.
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <AuthSelect
              icon="https://www.svgrepo.com/show/475656/google-color.svg"
              text="Đăng ký với Google"
            />
            <AuthSelect
              icon="https://www.svgrepo.com/show/511330/apple-173.svg"
              text="Đăng ký với Apple"
            />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-gray-400">
                Hoặc dùng Email
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tên
              </label>
              <Input
                id="userName"
                type="userName"
                name="userName"
                required
                placeholder="Nhập tên của bạn"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Địa chỉ email
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                required
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorPassword) setErrorPassword("");
                }}
                onBlur={() => {
                  if (password.length < 6) {
                    setErrorPassword("Mật khẩu ít hơn 6 ký tự!");
                  }
                }}
                className={
                  errorPassword
                    ? "border-red-500! focus:border-red-500! bg-red-50"
                    : ""
                }
              />
              {errorPassword && (
                <p className="text-red-500 text-xs mt-2 font-medium flex items-center">
                  <HiExclamationCircle className="w-4 h-4 mr-1" />
                  {errorPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nhập lại mật khẩu
              </label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorConfirm) setErrorConfirm("");
                }}
                onBlur={() => {
                  if (password !== confirmPassword) {
                    setErrorConfirm("Xác nhận mật khẩu không đúng!");
                  }
                }}
                className={
                  errorConfirm
                    ? "border-red-500! focus:border-red-500! bg-red-50"
                    : ""
                }
              />
              {errorConfirm && (
                <p className="text-red-500 text-xs mt-2 font-medium flex items-center">
                  <HiExclamationCircle className="w-4 h-4 mr-1" />
                  {errorConfirm}
                </p>
              )}
            </div>

            <AuthButton>Tạo tài khoản</AuthButton>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-gray-900 font-bold hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
