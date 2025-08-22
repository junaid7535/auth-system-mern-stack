import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center min-h-screen
        bg-stone-100 bg-cover bg-center'>
      
      <Navbar/>
      <Header></Header> 
    </div>
  )
}

export default Home
