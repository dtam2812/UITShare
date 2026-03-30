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
        className={`w-full rounded-xl border border-purple-400 px-4 py-3 pr-10 text-sm text-black transition-colors duration-300 outline-none placeholder:text-gray-400 focus:border-2 focus:border-purple-400 focus:bg-white/10 focus:ring-0 ${className}`}
        {...rest}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-white"
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      )}
    </div>
  );
};

export default Input;
