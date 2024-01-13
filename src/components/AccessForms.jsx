import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordToggle from './PasswordToggle';
import { setWithExpiry, getWithExpiry } from '../utils/localStorageUtils';

function AccessForms() {
    const [errors, setErrors] = useState({});
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const background = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/x.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
        setSuccess('');
    };

    const handleLogin = (token, role) => {
        setWithExpiry('token', token, 60);
        setWithExpiry('role', role, 60);
    };

    const handleSubmitForm = async (e) => {
    e.preventDefault();

    const formData = {
        email: e.target.email ? e.target.email.value.trim() : '',
        password: e.target.password ? e.target.password.value.trim() : '',
        registerEmail: e.target.registerEmail ? e.target.registerEmail.value.trim() : '',
        registerPassword: e.target.registerPassword ? e.target.registerPassword.value.trim() : '',
        confirmRegisterPassword: e.target.confirmRegisterPassword ? e.target.confirmRegisterPassword.value.trim() : '',
    };

    if (isLoginForm) {
        const validationErrors = {};
        console.log('Login form');

        const emailToClear = formData.email;
        const passwordToClear = formData.password;

        if (!emailToClear) {
            validationErrors.loginEmail = 'E-mail is required';
        }
        if (!passwordToClear) {
            validationErrors.loginPassword = 'Password is required';
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setErrors({});
            console.log(formData);
            try{
                const response = await fetch('http://localhost/api/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const responseData = await response.json();
                if (!response.ok) {
                    console.error('Error:', responseData.error);
                    if (responseData.error === 'Invalid account') {
                        setErrors({ loginEmail: 'Unrecognized email' });
                    } else if (responseData.error === 'Incorrect password') {
                        setErrors({ loginPassword: 'Incorrect password' });
                    }
                } else {
                    setSuccess('Sucessful login');
                    handleLogin(responseData.token, responseData.role);
                    navigate("/");

                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

    } else {
        const validationErrors = {};
        console.log('Register form');

        const emailToClear = formData.registerEmail;
        const passwordToClear = formData.registerPassword;
        const regPasswordToClear = formData.confirmRegisterPassword;

        if (!emailToClear) {
            validationErrors.registerEmail = 'E-mail is required';
        }   

        if (!passwordToClear) {
            validationErrors.registerPassword = 'Password is required';
        } else if (passwordToClear.trim().length < 8){
            validationErrors.registerPassword = 'Minimum length is 8 symbols';
        }

        if (!regPasswordToClear) {
            validationErrors.confirmRegisterPassword = 'Confirmation is required';
        } else if (regPasswordToClear !== passwordToClear) {
            validationErrors.confirmRegisterPassword = 'Passwords do not match';
        } else if(regPasswordToClear.trim().length < 8){
            validationErrors.confirmRegisterPassword = 'Minimum length is 8 symbols';
        }
        
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length === 0) {
            setErrors({});
            console.log(formData);
            try{
                const response = await fetch('http://localhost/api/register', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const responseData = await response.json();
                if (!response.ok) {
                    setErrors(responseData.errors);
                    setSuccess('');
                }else{
                    setSuccess(responseData.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
  };

    return(
        <div className="h-screen flex items-center justify-center w-full text-white" style={background}>
            <div className='flex w-full h-screen content-center justify-center items-center overflow-hidden'>
                <div className={`border-[3px] border-neutral-100 bg-[rgb(18,18,18,0.90)] ml-6 sm:ml-0 md:ml-0 lg:ml-0 lg:ml-0 h-[400px] xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[500px] w-[300px] font-light p-4  mr-5 bg-white rounded-md shadow-lg mb-4 transition-transform absolute transform ${isLoginForm ? 'translate-y-[0%]' : '-translate-y-[200%]'}`}>
                    <div className='relative w-full h-full flex flex-col'>
                        <div className='rounded-full w-20 h-20 absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-16 h-16 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 rounded-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                        <form className='w-full h-full flex flex-col justify-center items-center' onSubmit={(handleSubmitForm)}>
                            <div className='w-[90%]'>
                                <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='loginEmail'>E-mail</label>
                                <input className='focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm' type='email' id='email' name='email'/>
                                {errors.loginEmail && <p className="text-red-500 ml-3 my-2 text-lg">{errors.loginEmail}</p>}
                            </div>
                            <div className='w-[90%]'>
                            <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='loginPassword'>Password</label>
                                <PasswordToggle id='password'/>
                                {errors.loginPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.loginPassword}</p>}
                            </div>
                            <input className='mt-4 w-[75%] my-2 h-10 bg-[#23279C] text-white text-2xl rounded-sm duration-500 hover:scale-105 cursor-pointer' type='submit' value='Login' />
                            {success && <p className='text-green-500 ml-3 my-2 text-lg'>{success}</p>}
                        </form>
                        <h1 className='justify-center flex text-xl cursor-pointer font-light uppercase'>Forgot your password?</h1>
                    </div>
                    <p className='absolute top-2 right-0 mr-1 text-2xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-wide' onClick={toggleForm}>{isLoginForm ? 'Register' : 'Login'}</p>
                </div>
                <div className={`border-[3px] border-neutral-100 bg-[rgb(18,18,18,0.90)] ml-6 sm:ml-0 md:ml-0 lg:ml-0 lg:ml-0 h-[500px] xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[500px] w-[300px] font-light mr-5 p-4 bg-white rounded-md shadow-lg mb-4 space-x-4 transition-transform absolute transform ${isLoginForm ? '-translate-y-[200%]' : 'translate-y-[0%]'}`}>
                    <div className='relative w-full h-full flex flex-col'>
                        <div className='rounded-full w-20 h-20 absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-16 h-16 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 rounded-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                        <form className='w-full h-full flex flex-col justify-center items-center' onSubmit={(handleSubmitForm)}>
                            <div className='w-[90%]'>
                                <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='registerEmail'>E-mail</label>
                                <input className='focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm mb-2' type='email' id='registerEmail' name='registerEmail'/>
                                {errors.registerEmail && <p className="text-red-500 ml-3 my-2 text-lg">{errors.registerEmail}</p>}
                            </div>
                            <div className='w-[90%]'>
                            <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='registerPassword'>Password</label>
                                <PasswordToggle id='registerPassword'/>
                                {errors.registerPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.registerPassword}</p>}
                            </div>
                            <div className='w-[90%]'>
                            <label className='ml-3 text-lg uppercase tracking-widest mt-20' htmlFor='confirmRegisterPassword'>Confirm password</label>
                                <PasswordToggle id='confirmRegisterPassword'/>
                                {errors.confirmRegisterPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.confirmRegisterPassword}</p>}
                            </div>
                            <input className='mt-4 w-[75%] h-10 bg-[#3A3FC1] text-white text-2xl rounded-sm duration-500 hover:scale-105 cursor-pointer' type='submit' value='Register' />
                            {success && <p className='text-green-500 ml-3 my-2 text-lg'>{success}</p>}
                        </form>
                        <h1 className='justify-center flex text-xl cursor-pointer uppercase'>Or continue with</h1>
                    </div>
                    <p className='absolute top-2 right-2 mr-4 text-2xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-wide' onClick={toggleForm}>{isLoginForm ? 'Register' : 'Login'}</p>
                </div>
            </div>
        </div>
    );
}

export default AccessForms;