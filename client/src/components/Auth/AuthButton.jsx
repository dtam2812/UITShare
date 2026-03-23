const AuthButton = ({ children, ...rest }) => (
    <button 
        className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/30 cursor-pointer"
        {...rest}
    >
        {children}
    </button>
)

export default AuthButton