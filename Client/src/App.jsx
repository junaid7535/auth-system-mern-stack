import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ResetPassword from './pages/Reset-password'
import EmailVerify from './pages/Email-verify'

const App = () => {
  return (
    <div>
      <ToastContainer></ToastContainer>
     <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/email-verify' element={<EmailVerify/>} />
      <Route path='/reset-password' element={<ResetPassword/>} />
     </Routes>
    </div>
  )
}

export default App
