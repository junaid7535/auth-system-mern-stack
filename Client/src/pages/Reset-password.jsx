import React from "react";
import { assets } from '../assets/assets'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {

    axios.defaults.withCredentials = true;

    const inputRefs = React.useRef([])
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [isEmailSent,setIsEmailSent] = useState('');
    const [otp,setOtp] = useState(0);
    const [isOtpSubmitted,setIsOtpSubmitted] = useState(false);
    
    const handleInput = (e,index) => {
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
            inputRefs.current[index+1].focus()
        }
    }
    const handleKeyDown = (e,index) => {
        if(e.key === 'Backspace' && e.target.value === '' && index > 0){
            inputRefs.current[index-1].focus()
        }
    }

    const onSubmitEmail = async(e) => {
        e.preventDefault();

        const {data} = await axios.post('https://authentication-system-full-stack.onrender.com/api/sendResetOtp',{email});

        data.success && setIsEmailSent(true);
        
    }

    const onSubmitOtp = async(e) => {
        e.preventDefault();

        const otpArray = inputRefs.current.map(e => e.value);
        setOtp(otpArray.join(''));
        setIsOtpSubmitted(true);
    }

    const onSubmitNewPassword = async(e) => {
        e.preventDefault();

        const {data} = await axios.post('https://authentication-system-full-stack.onrender.com/api/resetPassword',{email,otp,newPassword})
        data.success && navigate('/login');
    }

    return (
       <div className='flex items-center justify-center min-h-screen
            px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'> 
            <img onClick={()=>navigate('/ ')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

            {!isEmailSent && 
            <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">

                <h1 className="text-white text-2xl front-semibold text-center mb-4">Reset Password</h1>
                <p className="text-center mb-6 text-indigo-300">Enter registered email</p>

                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <img src={assets.mail_icon} className="w-3 h-3" />
                    <input type="email" placeholder="email id" className="bg-transparent outline-none text-white" 
                    value={email}  onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900
                 text-white rounded-full mt-3 ">Submit</button>
            </form> 
            }

            {!isOtpSubmitted && isEmailSent && 
            <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">

                <h1 className="text-white text-2xl front-semibold text-center mb-4">password reset Otp</h1>
                <p className="text-center mb-6 text-indigo-300">Enter your otp</p>

                <div className="flex justify-between mb-8">
                    {Array(6).fill(0).map((_,index) => (
                        <input type="text" maxLength='1' key={index}
                        required className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                        ref = {e => inputRefs.current[index] = e} 
                        onInput={(e) => handleInput(e,index)}
                        onKeyDown={(e) => handleKeyDown(e,index)}
                        />
                    ))}
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full "> Submit </button>
            </form> 
            }   


            {isOtpSubmitted && isEmailSent && 
            <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">

                <h1 className="text-white text-2xl front-semibold text-center mb-4">new password</h1>
                <p className="text-center mb-6 text-indigo-300">Enter new password</p>

                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <img src={assets.lock_icon} className="w-3 h-3" />
                    <input type="password" placeholder="password" className="bg-transparent outline-none text-white" 
                    value={newPassword}  onChange={(e) => setNewPassword(e.target.value)} required/>
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900
                 text-white rounded-full mt-3 ">Submit</button>
            </form>
            }


        </div>
    )
}

export default ResetPassword