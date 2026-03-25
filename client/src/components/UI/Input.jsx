import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6"; 

const Input = ({ type, placeholder, className, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        placeholder={placeholder}
        className={`w-full px-4 py-3 pr-10 rounded-xl border border-white/20 bg-white/5 focus:bg-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 outline-none transition-all placeholder:text-gray-400 text-sm text-white ${className}`}
        {...rest}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      )}
    </div>
  );
};

export default Input;