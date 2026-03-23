import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router";
import loginImg from "../../assets/login-img.jpg" 
import AuthButton from "../../components/Auth/AuthButton";
import AuthSelect from "../../components/Auth/AuthSelect"
import Input from "../../components/UI/Input";
import { useState } from "react";
import { HiExclamationCircle } from "react-icons/hi";

const Register = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [errorConfirm, setErrorConfirm] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!email || !password || !confirmPassword) {
            alert('Chưa nhập đủ thông tin')
            return
        }

        if(password.length < 6) {
            setErrorPassword('Mật khẩu ít hơn 6 ký tự!')
            return
        }

        if (password !== confirmPassword) {
            setErrorConfirm('Mật khẩu xác nhận không đúng!')
            return
        }

        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-transparent text-white">

        <div className="hidden md:block p-2">
            <div className="h-full w-full rounded-2xl overflow-hidden relative border border-white/10">
                <img 
                    src={loginImg}
                    alt="Register Banner"
                    className="h-full w-full object-cover object-right opacity-80"
                />

                <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-linear-to-t from-[#050816] via-[#050816]/70 to-transparent"></div>

                <div className="absolute bottom-10 left-6 right-6 text-white z-10">
                    <h3 className="text-3xl font-bold mb-2 drop-shadow-md text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400">UITShare</h3>
                    <p className="text-gray-300 text-sm leading-relaxed drop-shadow-sm">
                        Tham gia cộng đồng chia sẻ tài liệu lớn nhất UIT.
                        <br />Bảo mật và minh bạch với công nghệ Blockchain.
                    </p>
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto z-10">
            
            <div className="w-full max-w-100"> 

                <div className="flex justify-center mb-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-full flex items-center">
                        <Link to="/login" className="text-gray-400 hover:text-purple-300 px-6 py-1.5 rounded-full text-sm font-medium transition-all">
                            Đăng nhập
                        </Link>
                        <button className="bg-purple-600 text-white shadow-sm px-6 py-1.5 rounded-full text-sm font-semibold transition-all">
                            Đăng ký
                        </button>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Tạo tài khoản</h1>
                    <p className="text-gray-400 text-sm">Bắt đầu hành trình chia sẻ tri thức của bạn.</p>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                    <AuthSelect
                        Icon={FcGoogle}
                        text="Tiếp tục với Google"
                    />
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 bg-[#050816] text-gray-400">Hoặc dùng Email</span>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Địa chỉ email</label>
                        <Input 
                            type="email"
                            name="email"
                            required
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Mật khẩu</label>
                        <Input 
                            type="password"
                            name="password"
                            required
                            placeholder="Nhập mật khẩu của bạn"
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value)
                                if(errorPassword) setErrorPassword('')
                            }}
                            onBlur={() => {
                                if(password.length < 6) {
                                    setErrorPassword('Mật khẩu ít hơn 6 ký tự!')
                                }
                            }}
                            className={errorPassword ? "border-red-500! focus:border-red-500! bg-red-500/10" : ""}
                        />
                        {errorPassword && (
                            <p className="text-red-400 text-xs mt-2 font-medium flex items-center">
                                <HiExclamationCircle className="w-4 h-4 mr-1" />
                                {errorPassword}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                            Nhập lại mật khẩu
                        </label>
                        <Input 
                            type="password" 
                            name="confirmPassword"
                            required
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={e => {
                                setConfirmPassword(e.target.value);
                                if(errorConfirm) setErrorConfirm('')
                            }}
                            onBlur={() => {
                                if(password !== confirmPassword) {
                                    setErrorConfirm('Xác nhận mật khẩu không đúng!')
                                }
                            }}
                            className={errorConfirm ? "border-red-500! focus:border-red-500! bg-red-500/10" : ""}
                        />
                        {errorConfirm && (
                            <p className="text-red-400 text-xs mt-2 font-medium flex items-center">
                                <HiExclamationCircle className="w-4 h-4 mr-1" />
                                {errorConfirm}
                            </p>
                        )}
                    </div>

                    <AuthButton>Tạo tài khoản</AuthButton>
                </form>

                <p className="text-center text-gray-400 text-sm mt-8">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300 hover:underline transition-colors">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>

    </div>
  );
};

export default Register;