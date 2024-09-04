"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../axios/axiosConfig'; // Use your Axios instance

// Create a Context with default values
const AuthContext = createContext();

// Create a provider component
 function AuthProvider({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hospitalData, setHospitalData] = useState([]); // Updated to hold hospital data
    const [medicationData,setMedicationData] = useState([])
    const [hospitalId,setHospitalId] = useState(null)
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');

            if (token) {
                try {
                    // Set the Authorization header with the token
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    // Validate token with a protected route
                    const response = await api.get('https://medical-api-advo.onrender.com/api/protected-route');
                    if (response.status === 200) {
                        setIsAuthenticated(true);
                        // Fetch hospital data if token is valid
                        
                        const hospitalResponse = await api.get(`https://medical-api-advo.onrender.com/api/hospital/${response?.data?.hospitalId}`);
                        setHospitalData(hospitalResponse.data);
                        localStorage.setItem("_id",hospitalResponse?.data._id)
                    } else {
                        // Token is not valid, redirect to login
                        setIsAuthenticated(false);
                        if (router.pathname !== '/login') {
                            router.push('/login');
                        }
                    }
                } catch (error) {
                    // Token verification failed, redirect to login
                    console.error('Token verification failed:', error);
                    setIsAuthenticated(false);
                    if (router.pathname !== '/login') {
                        router.push('/login');
                    }
                }
            } else {
                // No token found, redirect to login
                setIsAuthenticated(false);
                if (router.pathname !== '/login') {
                    router.push('/login');
                }
            }
        };
        checkAuth();
    }, [router]);
console.log(hospitalData)
    // const login = async (token) => {
    //     localStorage.setItem('token', token);
    //     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //     setIsAuthenticated(true);
    //     try {
    //         // Fetch hospital data after login
    //         const hospitalResponse = await api.get('/api/hospital-data');
    //         setHospitalData(hospitalResponse.data);
    //     } catch (error) {
    //         console.error('Failed to fetch hospital data:', error);
    //     }
    //     router.push('/dashboard');
    // };

    const logout = async () => {
        // try {
        //     // Optionally notify the server about logout here
        //     await api.post('/api/auth/logout');
        // } catch (error) {
        //     console.error('Logout failed:', error);
        // }
        localStorage.removeItem('accessToken');
        localStorage.removeItem("_id")
        setIsAuthenticated(false);
        setHospitalData(null); // Clear hospital data on logout
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, hospitalData, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Create a custom hook for easier context usage
export function useAuth() {
    return useContext(AuthContext);
}

export {AuthContext,AuthProvider}