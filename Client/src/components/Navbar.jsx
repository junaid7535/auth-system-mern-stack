import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'

const Navbar = () => {

  const navigate = useNavigate()
  const {userData,setUserData,setIsLoggedin} = useContext(AppContent)

  const verificationOtp = async () => {
    axios.defaults.withCredentials = true;


    const {data} = await axios.post('https://authentication-system-full-stack.onrender.com/api/send-verify-otp')
    if(data.success){
      navigate('/email-verify')
    }
  }

  const logout = async() => {
    axios.defaults.withCredentials = true;
    const {data} = await axios.post('https://authentication-system-full-stack.onrender.com/api/logoutUser');
    
    data.success && setIsLoggedin(false)
    data.success && setUserData(false)
    navigate('/')
  }

  return (
    <div className='w-full flex justify-between items-center p-4'>
      <img src={assets.logo} className='w-32' />

      {userData ? 
      <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
        {userData.name[0].toUpperCase()}
        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
          <ul className='list-none m-0 p2 bg-gray-100 text-sm'> 
 
            {!userData.isAccountVerified && <li onClick={verificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'> Verify Email</li>}

            <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'> Logout</li>
          </ul>
        </div>
      </div>
      :
      <button onClick={()=>navigate('/login')} 
      className='flex items-center border gap-2 border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100'> 
      <img src={assets.arrow_icon } alt="" />Login</button>
      }
      
    </div>
  ) 
} 

export default Navbar
