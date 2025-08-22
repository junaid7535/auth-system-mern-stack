import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContent = createContext()

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [isLoggedin,setIsLoggedin] = useState(false)
    const [userData,setUserData] = useState(false)

    const getAuthState = async() => {
        const {data} = await axios.get('https://authentication-system-full-stack.onrender.com/api/is-auth');
        if(data.success){
            setIsLoggedin(true)
            getUserData()
        }
    }

    const getUserData = async () => {
        const {data} = await axios.get('https://authentication-system-full-stack.onrender.com/api/data')

        data.success ? setUserData(data.userData) : toast.error(data.message)

        console.log(data);
    }

    useEffect(() => {
        getAuthState();
    },[]);

    const value = {
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value = {value}>
            {props.children}
        </AppContent.Provider>
    )
}