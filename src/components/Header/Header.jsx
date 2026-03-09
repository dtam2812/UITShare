import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineShoppingCart, HiBell, HiUser } from 'react-icons/hi';
import HeaderSearchBar from './HeaderSearchBar';

const Header = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('/src/assets/English-flag.svg');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State tạm để test đăng nhập
  const [accountOpen, setAccountOpen] = useState(false);
  
  const accountRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    setLangOpen(!langOpen);
  };
  const changeLang = lang => {
    setCurrentLang(lang);
    setLangOpen(false);
  };
  
  const handleLoginClick = () => {
    // Tạm thời set state để test, sau này bạn có thể đổi thành thẻ <a> hoặc useNavigate
    // window.location.href = '/login';
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccountOpen(false);
  };

  return <div className="w-full h-22 bg-gray-800 text-white flex items-center justify-between px-10">
            <div className='flex items-center gap-6 max-w-2xl flex-1 '>
                <div className="">
                    <img src="../public/UIT-Share-Logo-2.svg" alt="Logo" className="h-16 w-15 object-cover flex items-center justify-center mt-2.5 flex-shrink-0" />
                </div>

                <div className="flex-1 mx-6 max-w-2xl">
                    <HeaderSearchBar />
                </div>
            </div>
            <nav className="hidden lg:flex items-center gap-2 pr-7">
                <a href="#" className=" text-sm font-semibold hover:text-gray-200 px-3">Đại cương</a>
                <a href="#" className=" text-sm font-semibold hover:text-gray-200 px-3">Cơ sở ngành</a>
                <a href="#" className=" text-sm font-semibold hover:text-gray-200 px-3">Chuyên ngành</a>
            </nav>
           
            <div className="flex items-center gap-7 flex-shrink-0">
                <div className="relative flex items-center">
                    <button onClick={toggleLanguage} className="inline-flex items-center gap-1 border-none bg-transparent cursor-pointer transition hover:opacity-80">
                        <img src={currentLang} alt="flag" className="w-8 h-5 object-contain" />
                        <span className={`text-xs transition-transform ${langOpen ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </button>
                    
                    {langOpen && <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded shadow-lg z-[100] p-2 min-w-max">
                            <button onClick={() => changeLang('/src/assets/English-flag.svg')} className="block w-full text-left px-2 py-2 hover:bg-gray-600 rounded">
                                <img src="/src/assets/English-flag.svg" alt="English" className="w-10 h-5 object-contain" />
                            </button>
                            <button onClick={() => changeLang('/src/assets/Flag_of_Vietnam.svg')} className="block w-full text-left px-2 py-2 hover:bg-gray-600 rounded border-t border-gray-600 mt-1">
                                <img src="/src/assets/Flag_of_Vietnam.svg" alt="Vietnam" className="w-10 h-5 object-contain" />
                            </button>
                        </div>}
                </div>

                {!isLoggedIn ? (
                    <button 
                        onClick={handleLoginClick} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                    >
                        Đăng nhập
                    </button>
                ) : (
                    <>
                        <button className="hover:opacity-80 transition">
                            <HiOutlineShoppingCart size={24} />
                        </button>

                        <button className="hover:opacity-80 transition relative">
                            <HiBell size={24} />
                        </button>

                        <div className="relative" ref={accountRef}>
                            <button 
                                onClick={() => setAccountOpen(!accountOpen)}
                                className="hover:opacity-80 transition flex items-center"
                                title="Tài khoản"
                            >
                                <HiUser size={24} />
                            </button>

                            {accountOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-700 text-white rounded-md shadow-lg z-[100] py-1 ">
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                                        Hồ sơ
                                    </a>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button 
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>;
};
export default Header;