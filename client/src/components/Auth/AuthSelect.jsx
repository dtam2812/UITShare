const AuthSelect = ({ Icon, text }) => {
    return (
        <button 
            className="flex items-center justify-center gap-3 px-4 py-2.5 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition font-medium text-gray-300 hover:text-white text-sm cursor-pointer" 
            type="button"
        >
            {Icon && <Icon className="text-xl" />}
            {text}
        </button>
    );
};

export default AuthSelect;