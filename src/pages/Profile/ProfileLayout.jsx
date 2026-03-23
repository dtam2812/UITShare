import { Outlet } from "react-router";
import { FiMenu, FiX } from "react-icons/fi"; 
import ProfileSidebar from "../../components/Profile/ProfileSidebar";
import { useState } from "react";

const ProfileLayout = () => {

    const [openSidebar, setOpenSidebar] = useState(false)

    const handleClick = () => {
        setOpenSidebar(prev => !prev)
    }

    return (
    <div className="flex min-h-screen bg-[#050816] font-sans text-white relative overflow-hidden">
        
        <button
        onClick={handleClick}
        className={`md:hidden fixed top-4 right-4 z-50 p-2 bg-white/5 border border-white/10 rounded-lg shadow-md text-gray-300 hover:bg-white/10 hover:text-white backdrop-blur-md focus:outline-none transition-colors`}
        >
            {openSidebar ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>

        <div 
        onClick={handleClick}
        className={`md:hidden fixed inset-0 bg-[#050816]/80 backdrop-blur-sm z-40 transition-opacity ${openSidebar ? "" : "hidden"}`}
        ></div>

        <aside
        className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-[#050816] border-r border-white/10 shadow-xl
            transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:shadow-none flex-shrink-0
            ${openSidebar ? "translate-x-0" : "-translate-x-full"}
        `}
        >
        <ProfileSidebar />
        </aside>

        <main className="flex-1 w-full flex flex-col h-screen overflow-y-auto">
        <div className="p-6 md:p-10 flex-1 w-full max-w-5xl mx-auto">
            <Outlet />
        </div>
        </main>

    </div>
    );
};

export default ProfileLayout;