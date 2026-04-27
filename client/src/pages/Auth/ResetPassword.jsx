import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import loginImg from "../../assets/login-img.jpg";
import Input from "../../components/UI/Input";
import AuthButton from "../../components/Auth/AuthButton";
import { HiExclamationCircle } from "react-icons/hi";
import axios from "../../common";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Kiểm tra token còn hợp lệ không khi vào trang
  useEffect(() => {
    const validate = async () => {
      try {
        await axios.get(`/api/auth/validate-reset-token/${token}`);
        setTokenValid(true);
      } catch {
        setTokenValid(false);
      } finally {
        setValidating(false);
      }
    };
    if (token) validate();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setConfirmError("");

    let valid = true;

    if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
      valid = false;
    }
    if (password !== confirmPassword) {
      setConfirmError("Mật khẩu xác nhận không khớp.");
      valid = false;
    }
    if (!valid) return;

    try {
      setLoading(true);
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Loading kiểm tra token ---
  if (validating) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050816]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Banner trái */}
      <div className="hidden md:block p-2">
        <div className="h-full w-full rounded-2xl overflow-hidden relative">
          <img
            src={loginImg}
            alt="Reset Password"
            className="h-full w-full object-cover object-right opacity-80"
          />
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-linear-to-t from-[#050816] via-[#050816]/70 to-transparent" />
          <div className="absolute bottom-10 left-6 right-6 text-white z-10">
            <h3 className="text-3xl font-bold mb-2 drop-shadow-md">UITShare</h3>
            <p className="text-gray-300 text-sm leading-relaxed drop-shadow-sm">
              Đặt mật khẩu mới để bảo vệ tài khoản của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Form phải */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 h-full">

        {/* Token không hợp lệ */}
        {!tokenValid && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/30">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Link không hợp lệ</h1>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu lại.
            </p>
            <Link
              to="/forgotPassword"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Gửi lại email
            </Link>
          </div>
        )}

        {/* Đặt lại thành công */}
        {tokenValid && success && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 ring-1 ring-green-500/30">
              <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Đặt lại thành công!</h1>
            <p className="text-gray-400 text-sm mb-6">
              Mật khẩu mới của bạn đã được cập nhật.
            </p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}

        {/* Form nhập mật khẩu mới */}
        {tokenValid && !success && (
          <>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">Đặt mật khẩu mới</h1>
              <p className="text-gray-400 text-sm">
                Nhập mật khẩu mới cho tài khoản của bạn.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                  Mật khẩu mới
                </label>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  className={passwordError ? "border-red-500! focus:border-red-500! bg-red-500/10" : ""}
                />
                {passwordError && (
                  <p className="text-red-400 text-xs mt-2 font-medium flex items-center gap-1">
                    <HiExclamationCircle className="w-4 h-4" />
                    {passwordError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                  Xác nhận mật khẩu
                </label>
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmError) setConfirmError("");
                  }}
                  className={confirmError ? "border-red-500! focus:border-red-500! bg-red-500/10" : ""}
                />
                {confirmError && (
                  <p className="text-red-400 text-xs mt-2 font-medium flex items-center gap-1">
                    <HiExclamationCircle className="w-4 h-4" />
                    {confirmError}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
              )}

              <AuthButton disabled={loading}>
                {loading ? "Đang cập nhật..." : "Xác nhận mật khẩu mới"}
              </AuthButton>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;