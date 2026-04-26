import { Link } from "react-router";
import loginImg from "../../assets/login-img.jpg";
import Input from "../../components/UI/Input";
import AuthButton from "../../components/Auth/AuthButton";
import { useState } from "react";
import axios from "../../common";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Banner trái */}
      <div className="hidden md:block p-2">
        <div className="h-full w-full rounded-2xl overflow-hidden relative">
          <img
            src={loginImg}
            alt="Forgot Password Banner"
            className="h-full w-full object-cover object-right opacity-80"
          />
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-linear-to-t from-[#050816] via-[#050816]/70 to-transparent" />
          <div className="absolute bottom-10 left-6 right-6 text-white z-10">
            <h3 className="text-3xl font-bold mb-2 drop-shadow-md">UITShare</h3>
            <p className="text-gray-300 text-sm leading-relaxed drop-shadow-sm">
              Khôi phục quyền truy cập vào kho tri thức của bạn.
              <br />
              An toàn, bảo mật và nhanh chóng.
            </p>
          </div>
        </div>
      </div>

      {/* Form phải */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 h-full relative">
        <div className="absolute top-8 right-8">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
          >
            Quay lại Đăng nhập →
          </Link>
        </div>

        {sent ? (
          /* --- Trạng thái đã gửi --- */
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 ring-1 ring-green-500/30">
              <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Đã gửi email!</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              Nếu địa chỉ <span className="text-white font-medium">{email}</span> tồn tại trong hệ thống, 
              chúng tôi đã gửi link đặt lại mật khẩu. Kiểm tra hộp thư (kể cả thư mục Spam).
            </p>
            <p className="text-gray-500 text-xs mb-6">Link có hiệu lực trong 1 giờ.</p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="text-sm text-purple-400 hover:text-purple-300 underline transition-colors"
            >
              Thử lại với email khác
            </button>
          </div>
        ) : (
          /* --- Form nhập email --- */
          <>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">Quên mật khẩu?</h1>
              <p className="text-gray-400 text-sm">
                Nhập email sinh viên của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                  Địa chỉ email
                </label>
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder="mssv@gm.uit.edu.vn"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                />
                {error && (
                  <p className="text-red-400 text-xs mt-2 font-medium">{error}</p>
                )}
              </div>

              <AuthButton disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
              </AuthButton>
            </form>

            <div className="mt-12 p-4 bg-white/5 rounded-xl border border-dashed border-white/10 text-center">
              <p className="text-xs text-gray-400">
                Gặp khó khăn? Liên hệ hỗ trợ tại:{" "}
                <a
                  href="mailto:support@uitshare.com"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 underline"
                >
                  support@uitshare.com
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;