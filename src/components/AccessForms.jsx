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

    const formData = new FormData(e.target);

    if (isLoginForm) {
      const validationErrors = {};
      console.log('Login form');

      const emailToClear = formData.get('loginEmail').trim();
      const passwordToClear = formData.get('loginPassword').trim();

      if (!emailToClear) {
        validationErrors.loginEmail = 'E-mail is required';
      }
      if (!passwordToClear) {
        validationErrors.loginPassword = 'Password is required';
      }

      setErrors(validationErrors);

    } else {
      const validationErrors = {};
      console.log('Register form');

      const emailToClear = formData.get('registerEmail').trim();
      const passwordToClear = formData.get('registerPassword').trim();
      const regPasswordToClear = formData.get('confirmRegisterPassword').trim();

      if (!emailToClear) {
        validationErrors.registerEmail = 'E-mail is required';
      }else{
        validationErrors.registerEmail = '';
      }

      if (!passwordToClear) {
        validationErrors.registerPassword = 'Password is required';
      }else{
        validationErrors.registerPassword = '';
      }

      if (!regPasswordToClear) {
        validationErrors.confirmRegisterPassword = 'Confirmation is required';
      }else{
        validationErrors.confirmRegisterPassword = '';
      }

      if(regPasswordToClear !== passwordToClear){
        validationErrors.confirmRegisterPassword = 'Passwords do not match';
      }else{
        validationErrors.confirmRegisterPassword = '';
      }

      setErrors(validationErrors);
    }
  };

    return(
        <div className='flex w-full h-screen justify-center items-center overflow-hidden'>
            <div className={`border-[3px] border-neutral-700 h-[400px] xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[500px] w-[315px] font-light p-4 bg-white rounded-md shadow-lg mb-4 space-x-4 transition-transform absolute transform ${isLoginForm ? 'translate-y-[0%]' : '-translate-y-[200%]'}`}>
                <div className='relative w-full h-full flex flex-col'>
                    <div className='rounded-full w-20 h-20 absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </div>
                    <form className='w-full h-full flex flex-col justify-center items-center' onSubmit={(handleSubmitForm)}>
                        <div className='w-[90%]'>
                            <label className='ml-3 text-lg' htmlFor='loginEmail'>E-mail</label>
                            <input className='focus:outline-none my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm' type='email' id='loginEmail' name='loginEmail'/>
                            {errors.loginEmail && <p className="text-red-500 ml-3 my-2 text-lg">{errors.loginEmail}</p>}
                        </div>
                        <div className='w-[90%]'>
                        <label className='ml-3 text-lg' htmlFor='loginPassword'>Password</label>
                            <PasswordToggle id='loginPassword'/>
                            {errors.loginPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.loginPassword}</p>}
                        </div>
                        <input className='mt-4 w-[75%] my-2 h-10 bg-[#851cea] text-white text-2xl rounded-sm duration-500 hover:w-[80%] hover:h-[14%] cursor-pointer' type='submit' value='Login' />
                        <p className='text-red-500 text-lg'>errormessage</p>    
                    </form>
                    <h1 className='justify-center flex text-xl cursor-pointer'>Forgot your password?</h1>
                </div>
            </div>

            <div className={`border-[3px] border-neutral-700 h-[500px] xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[500px] w-[315px] font-light p-4 bg-white rounded-md shadow-lg mb-4 space-x-4 transition-transform absolute transform ${isLoginForm ? '-translate-y-[200%]' : 'translate-y-[0%]'}`}>
                <div className='relative w-full h-full flex flex-col'>
                    <div className='rounded-full w-20 h-20 absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </div>
                    <form className='w-full h-full flex flex-col justify-center items-center' onSubmit={(handleSubmitForm)}>
                        <div className='w-[90%]'>
                            <label className='ml-3 text-lg' htmlFor='registerEmail'>E-mail</label>
                            <input className='focus:outline-none focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm mb-2' type='email' id='registerEmail' name='registerEmail'/>
                            {errors.registerEmail && <p className="text-red-500 ml-3 my-2 text-lg">{errors.registerEmail}</p>}
                        </div>
                        <div className='w-[90%]'>
                        <label className='ml-3 text-lg' htmlFor='registerPassword'>Password</label>
                            <PasswordToggle id='registerPassword'/>
                            {errors.registerPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.registerPassword}</p>}
                        </div>
                        <div className='w-[90%]'>
                        <label className='ml-3 text-lg' htmlFor='confirmRegisterPassword'>Confirm password</label>
                            <PasswordToggle id='confirmRegisterPassword'/>
                            {errors.confirmRegisterPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.confirmRegisterPassword}</p>}
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