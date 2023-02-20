import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/auth';
import Login from '../pages/auth';

export default function LoadingScreen(){
    const router = useRouter();
    const { user, loading } = useAuth();
    
    if(loading){
        return (
            <>
                <Head>
                    <title>Login - Employee Management</title>
                </Head>
                <div className="relative">
                    <div className="absolute inset-0 h-screen flex">
                        <div className="m-auto">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-400"></div>
    
                        </div>
                    </div>
                </div>
            </>
           
        )
    }else{
        router.push('/auth');
        return <Login></Login>
       
    }
   
}