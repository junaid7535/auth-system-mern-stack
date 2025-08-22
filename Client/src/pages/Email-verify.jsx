import React, { useEffect } from "react";
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { AppContent } from '../context/AppContext'
import { useContext } from 'react'

const EmailVerify = () => {
    axios.defaults.withCredentials
    const {backendUrl,isLoggedin,userData,getUserData} = useContext(AppContent)
    const navigate = useNavigate();
    const inputRefs = React.useRef([])

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

    const onSubmitHandler = async(e) => {
        e.preventDefault()
        const otpArray = inputRefs.current.map(e => e.value);
        const otp = otpArray.join('');

        const {data} = await axios.post('https://authentication-system-full-stack.onrender.com/api/verify-account',{otp});

        if(data.success){
            getUserData()
            navigate('/')
        }
    }

    useEffect(() => {
        isLoggedin && userData && userData.isAccountVerified && navigate('/')
    },[isLoggedin,userData])


    return (
        <div className='flex items-center justify-center min-h-screen
            px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>

            <img onClick={()=>navigate('/ ')} src={assets.logo} className='absolute left-5 sm:left-20 
            top-5 w-28 sm:w-32 cursor-pointer' />

            <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">

                <h1 className="text-white text-2xl front-semibold text-center mb-4">Email Verify Otp</h1>

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

                <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full "> verify email </button>
            </form>

        </div>
    )
}

export default EmailVerify