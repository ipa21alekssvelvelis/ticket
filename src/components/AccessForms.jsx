import React, { useState } from 'react';
import PasswordToggle from './PasswordToggle';
function AccessForms() {
    const [errors, setErrors] = useState({});
    const [isLoginForm, setIsLoginForm] = useState(true);
    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
    
        if (isLoginForm) {
            console.log('Login form');
            
        } else {
            console.log('Register form');
            
        }
      };

    return(
        <div className='flex w-full h-full justify-center items-center overflow-hidden'>
            <div className={`border-2 border-neutral-600 h-[400px] xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[500px] w-[315px] font-light p-4 bg-white rounded-md shadow-lg mb-4 space-x-4 transition-transform absolute transform ${isLoginForm ? 'translate-y-[0%]' : 'translate-y-[200%]'}`}>
                <div className='relative w-full h-full flex flex-col'>
                    <div className='rounded-full w-20 h-20 absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </div>
                    <form className='w-full h-full flex flex-col justify-center items-center' onSubmit={(handleSubmitForm)}>
                        <div className='w-[90%]'>
                            <label className='ml-3 text-lg' for='email'>E-mail</label>
                            <input className='focus:outline-none focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm' type='email' id='email' name='email'/>
                            <p className='text-red-500 ml-3 text-lg'>errormessage</p>
                        </div>
                        <div className='w-[90%]'>
                        <label className='ml-3 text-lg' for='password'>Password</label>
                            <PasswordToggle/>
                            <p className='text-red-500 ml-3 text-lg'>errormessage</p>
                        </div>
                        <input className='mt-4 w-[75%] h-10 bg-[#851cea] text-white text-2xl rounded-sm duration-500 hover:w-[80%] hover:h-[14%] cursor-pointer' type='submit' value='Login' />
                        <p className='text-red-500 text-lg'>errormessage</p>    
                    </form>
                    <h1 className='justify-center flex text-xl cursor-pointer'>Forgot your password?</h1>
                </div>
            </div>
            <div className={`border-2 border-neutral-600 h-[500px] xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[500px] w-[315px] font-light p-4 bg-white rounded-md shadow-lg mb-4 space-x-4 transition-transform absolute transform ${isLoginForm ? '-translate-y-[200%]' : 'translate-y-[0%]'}`}>
                <div className='relative w-full h-full flex flex-col'>
                    <div className='rounded-full w-20 h-20 absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </div>
                    <form className='w-full h-full flex flex-col justify-center items-center' onSubmit={(handleSubmitForm)}>
                        <div className='w-[90%]'>
                            <label className='ml-3 text-lg' for='email'>E-mail</label>
                            <input className='focus:outline-none focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm' type='email' id='email' name='email'/>
                            <p className='text-red-500 ml-3 text-lg'>errormessage</p>
                        </div>
                        <div className='w-[90%]'>
                        <label className='ml-3 text-lg' for='password'>Password</label>
                            <PasswordToggle/>
                            <p className='text-red-500 ml-3 text-lg'>errormessage</p>
                        </div>
                        <div className='w-[90%]'>
                        <label className='ml-3 text-lg' for='password'>Confirm pass</label>
                            <PasswordToggle/>
                            <p className='text-red-500 ml-3 text-lg'>errormessage</p>
                        </div>
                        <input className='mt-4 w-[75%] h-10 bg-[#ee4de1] text-white text-2xl rounded-sm duration-500 hover:w-[80%] hover:h-[14%] cursor-pointer' type='submit' value='Register' />
                        <p className='text-red-500 text-lg'>errormessage</p>
                    </form>
                    <h1 className='justify-center flex text-xl cursor-pointer'>Or continue with</h1>
                </div>
            </div>
        <p className='absolute top-2 right-2 mr-4 text-2xl hover:bg-[#DED8E5] duration-500 transition-bg cursor-pointer p-1 rounded-md' onClick={toggleForm}>{isLoginForm ? 'Register' : 'Login'}</p>
        </div>
        
    );
}

export default AccessForms;