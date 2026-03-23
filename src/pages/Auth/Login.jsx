import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router";
import loginImg from "../../assets/login-img.jpg" 
import AuthButton from "../../components/Auth/AuthButton";
import AuthSelect from "../../components/Auth/AuthSelect";
import Input from "../../components/UI/Input";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!email || !password) {
            alert('Chưa nhập đủ thông tin!')
            return
        }

        setEmail('')
        setPassword('')
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-transparent text-white">
        
        <div className="flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto z-10">
            
            <div className="w-full max-w-100"> 

                <div className="flex justify-center mb-8">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-full flex items-center">
                        <button className="bg-purple-600 text-white shadow-sm px-6 py-1.5 rounded-full text-sm font-semibold transition-all">
                            Đăng nhập
                        </button>
                        <Link to="/register" className="text-gray-400 hover:text-purple-300 px-6 py-1.5 rounded-full text-sm font-medium transition-all">
                            Đăng ký
                        </Link>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Xin chào</h1>
                    <p className="text-gray-400 text-sm">Vui lòng nhập thông tin của bạn để đăng nhập</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Địa chỉ email</label>
                        <Input 
                            type="email"
                            placeholder="Nhập địa chỉ email của bạn"
                            name="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-semibold text-gray-300">Mật khẩu</label>
                            <Link to="/forgotpassword" className="text-xs text-gray-400 hover:text-purple-400 font-medium transition-colors">Quên mật khẩu?</Link>
                        </div>
                        <Input 
                            type="password"
                            placeholder="Nhập mật khẩu của bạn"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <AuthButton>Đăng nhập</AuthButton>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 bg-[#050816] text-gray-400">Hoặc</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <AuthSelect 
                        Icon={FcGoogle}
                        text="Tiếp tục với Google"
                    />
                </div>

                <p className="text-center text-gray-400 text-sm mt-8">
                    Bạn chưa có tài khoản?{" "}
                    <Link to="/register" className="text-purple-400 font-bold hover:text-purple-300 hover:underline transition-colors">
                        Đăng ký
                    </Link>
                </p>
            </div>
        </div>

        <div className="hidden md:block p-2">
            <div className="h-full w-full rounded-2xl overflow-hidden relative border border-white/10">
                <img 
                    src={loginImg}
                    alt="Login Banner"
                    className="h-full w-full object-cover object-right opacity-80"
                />
                
                <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-linear-to-t from-[#050816] via-[#050816]/70 to-transparent"></div>

                <div className="absolute bottom-10 left-6 right-6 text-white z-10">
                    <h3 className="text-3xl font-bold mb-2 drop-shadow-md text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400">UITShare</h3>
                    <p className="text-gray-300 text-sm leading-relaxed drop-shadow-sm">
                        Nền tảng chia sẻ tài liệu số 1 dành cho sinh viên UIT. 
                        <br />Học tập hiệu quả, chia sẻ đam mê.
                    </p>
                </div>
            </div>
        </div>

    </div>
  );
};

export default Login;