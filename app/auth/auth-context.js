"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContainerLayout from '../components/ContainerLayout';
// Create a Context with default values
const AuthContext = createContext({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    test: { me: "hello" }
});

// Create a provider component
export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [test, setTest] = useState({ me: "hello" });
    const router = useRouter();

    useEffect(() => {
        // Replace this with your actual authentication check
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                router.push('/login')
            } else{
                router.push('dashboard')
            }
        };
        checkAuth();
    }, []);

    // Mock login function
    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        router.push('/dashboard'); // Redirect to home or other page
    };

    // console.log(isAuthenticated)

    // Mock logout function
    const logout = () => {
        console.log(1)
        localStorage.removeItem('token');
        // setIsAuthenticated(false);
        router.push('/login'); // Redirect to login page
      };
      

    return (
        <AuthContext.Provider value={{ isAuthenticated, login,logout  }}>
            {children}
        </AuthContext.Provider>
    );
}

// Create a custom hook for easier context usage
export function useAuth() {
    return useContext(AuthContext);
}
