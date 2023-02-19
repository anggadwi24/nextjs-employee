import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router';
import api from "@/lib/api";
import { setCookie,getCookie,deleteCookie } from 'cookies-next';
import LoadingScreen from '@/components/LoadingScreen';

const AuthContext = createContext({});

export const AuthProvider = ({ children} : {children:any}) => {
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)

    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function loadUserFromCookies() {
            const token = getCookie('token')

            if (token) {

                api.defaults.headers.Authorization = `Bearer ${token}`
                const { data: user } = await api.get('/my')
               
                if (user)
                    setUser(user);
                    setRole(user.role);

            }
            setLoading(false)
        }
        loadUserFromCookies()
    }, [])
    const login = async ({ setErrors , email, password } : {setErrors:any,email:any,password:any}) => {
        setLoading(true);

        setErrors([]);
        api
            .post("/login", { email, password })
            .then((res) => {
                setLoading(false);
                if (res.data.statusCode == 200) {
                    if (res.data.token) {
                        setCookie('token', res.data.token)
                        api.defaults.headers.Authorization = `Bearer  ${res.data.token}`
                        setUser(res.data.user)

                        router.push("/")
                    }
                } else {
                    setErrors(res.data.msg);

                }
            })
    }

    const logout = () => {
        api
            .get("/logout")
            .then((res) => {
                deleteCookie('token');
                setUser(null)
                delete api.defaults.headers.Authorization
                router.push('/login')
            })
            .catch(error => {

                if (error.response.status != 401) throw error


            })

    }
    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, loading, logout,role,error,setError }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)
export const ProtectRoute = ({ children  } : {children : any}) => {
    const routers = useRouter();
    const { isAuthenticated , isLoading } : any  = useAuth();
    if (isLoading || (!isAuthenticated )){
        
       return <LoadingScreen/>
    }else{
        return children;

    }
  };