import React, { useState } from "react";
import { Link } from 'react-router-dom';
function Header() {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        window.location.href = 'http://localhost:3000/Login';
    };

    return (
        <>
            <div className="w-screen h-[70px] bg-[#851CEA] flex justify-between items-center absolute top-0">
                <div className="flex items-center">
                        <button onClick={toggleMobileMenu} className="flex p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                </div>
                    {/* <button onClick={handleLogout} className="max-[770px]:font-light max-[770px]:text-2xl w-[120px] h-10 rounded-xl border bg-[#5D75B1] border-[#5D75B1] text-white text-center m-3 flex justify-center items-center text-xl hover:bg-[#56699A] transition delay-50 hover:border-neutral-200">LOG OUT</button> */}
            </div>
            {isMobileMenuOpen && (
                <div className="w-screen h-screen fixed top-0 left-0 z-50 flex flex-col justify-center items-center bg-[#96B1DC] overflow-hidden">
                    <button onClick={toggleMobileMenu} className="flex p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 absolute top-3 left-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                        <div className="max-[770px]:w-[40%] max-[770px]:p-4 max-[770px]:h-[8%] max-[770px]:my-8 max-[770px]:-mt-12 max-[770px]:text-2xl max-[770px]:font-light max-[770px]:border-[2.5px] w-[120px] h-10 rounded-xl border border-[#5D75B1] text-white bg-[#5D75B1] text-center m-3 flex justify-center items-center text-md hover:bg-[#56699A] transition delay-50 hover:border-neutral-200">USERS</div>
                    <button onClick={handleLogout} className="max-[770px]:w-[40%] max-[770px]:p-6 max-[770px]:h-[8%] max-[770px]:my-8 max-[770px]:text-2xl max-[770px]:font-light max-[770px]:border-[2.5px] w-[120px] h-10 rounded-xl border border-[#5D75B1] text-white bg-[#5D75B1] text-center m-3 flex justify-center items-center text-md hover:bg-[#56699A] transition delay-50 hover:border-neutral-200 font-light">LOG OUT</button>
                </div>
            )}
        </>
    );
}
export default Header;