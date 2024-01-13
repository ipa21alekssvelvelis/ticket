import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { getWithExpiry } from '../utils/localStorageUtils';

function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isLoggedIn = localStorage.getItem('token');
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const navigate = useNavigate();

    // console.log(localStorage.getItem('role'));
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${isLoggedIn}`,
                }
            });
    
            if (response.ok) {
                localStorage.removeItem('role');
                localStorage.removeItem('token');
                navigate("/");
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };

    return (
        <>
            <div className="w-screen h-[70px] bg-[rgb(10,10,10,0.05)] flex justify-between items-center z-50 absolute top-0">
                <div className="flex items-center sm:ml-4 md:ml-4 lg:ml-4 w-full justify-center md:justify-normal sm:justify-normal lg:justify-normal">
                    <button onClick={toggleMobileMenu} className="flex p-3 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-10 h-10 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <Link to="/" className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer">Billetin</Link>
                </div>
                {!isLoggedIn && (
                    <Link to="/Authenticate" className="hidden sm:flex md:flex lg:flex font-light text-3xl w-[120px] h-10 rounded-sm hover:bg-white hover:text-black font-light uppercase tracking-widest text-white text-3xl text-center m-3 flex justify-center items-center hover:bg-[#DED8E5] duration-500 transition-bg cursor-pointer p-1 rounded-md">Login</Link>
                )}
                {(isLoggedIn && getWithExpiry('role') === 'admin') && (
                    <Link to="/AdminPanel" className="hidden sm:flex md:flex lg:flex font-light text-3xl w-[120px] h-10 rounded-sm hover:bg-white hover:text-black font-light uppercase tracking-widest text-white text-3xl text-center m-3 flex justify-center items-center hover:bg-[#DED8E5] duration-500 transition-bg cursor-pointer p-1 rounded-md">Admin</Link>
                )}
            </div>
            <div className={`w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-40 z-30 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}></div>
            <div className={`w-full overflow-y-scroll sm:w-[45%] md:w-[45%] lg:w-[45%] xl:w-[45%] h-screen fixed top-0 left-0 z-50 flex text-white flex-col items-center justify-center bg-[rgb(18,18,18,0.97)] overflow-hidden transition-transform transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-full h-full flex flex-col">
                    <div className="h-[10%] w-full">
                        <div className="flex items-center sm:ml-6 md:ml-6 lg:ml-6 my-1 w-full justify-center sm:justify-normal lg:justify-normal md:justify-normal">
                            <button onClick={toggleMobileMenu} className="flex p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-10 h-10 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                            <Link to="/" className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer">Billetin</Link>
                        </div>
                    </div>
                    <div className="h-full w-full flex flex-col justify-evenly">
                        <div className=" w-full flex mb-2 flex-col items-center">
                            <div className="flex items-center justify-center w-full flex-col md:flex-row lg:flex-row sm:flex-row md:ml-12 sm:ml-12 lg:ml-12">
                                <div className="flex p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>
                                </div>
                                <div className="w-full">
                                    <h1 className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Home</h1> 
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex mb-2 flex-col items-center">
                            <div className="flex items-center w-full flex-col md:flex-row lg:flex-row sm:flex-row md:ml-12 sm:ml-12 lg:ml-12">
                                <div className="flex p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                    </svg>
                                </div>
                                <div className="w-full">
                                    <h1 className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Tickets</h1> 
                                </div>
                            </div>
                        </div>
                        <div className=" w-full flex mb-2 flex-col items-center">
                            <div className="flex items-center w-full flex-col md:flex-row lg:flex-row sm:flex-row md:ml-12 sm:ml-12 lg:ml-12">
                                <div className="flex p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </div>
                                <div className="w-full">
                                    <h1 className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Reviews</h1> 
                                </div>
                            </div>
                        </div>
                        <div className=" w-full flex mb-2 flex-col items-center">
                            <div className="flex items-center w-full flex-col md:flex-row lg:flex-row sm:flex-row md:ml-12 sm:ml-12 lg:ml-12">
                                <div className="flex p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                                    </svg>
                                </div>
                                <div className="w-full">
                                    <h1 className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Purchases</h1> 
                                </div>
                            </div>
                        </div>
                        {(isLoggedIn && getWithExpiry('role') === 'admin') &&
                            <div className=" w-full flex mb-2 flex-col items-center">
                                <div className="flex items-center w-full flex-col md:flex-row lg:flex-row sm:flex-row md:ml-12 sm:ml-12 lg:ml-12">
                                    <div className="flex p-2">
                                        <Link to="/AdminPanel">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        </Link>
                                    </div>
                                    <div className="w-full">
                                        <Link to="/AdminPanel">
                                        <h1 className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Control panel</h1>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className=" w-full flex mb-2 flex-col items-center">
                            <div className="flex items-center w-full flex-col md:flex-row lg:flex-row sm:flex-row md:ml-12 sm:ml-12 lg:ml-12">
                                <div className="flex p-2">
                                    {isLoggedIn ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                        </svg> 
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                        </svg>
                                    )}
                                </div>
                                <div className="w-full text-center sm:text-start md:text-start lg:text-start xl:text-start">
                                    {isLoggedIn ? (
                                     <button onClick={handleLogout} className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Logout</button>
                                    ):(
                                      <Link to="/Authenticate" className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Login</Link>   
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
