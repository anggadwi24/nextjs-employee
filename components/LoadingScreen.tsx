import { useAuth } from '@/context/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react'

type Props = {}

const LoadingScreen = (props: Props) => {
    const router = useRouter();
    const { user, loading } : any = useAuth();
    
    if(loading){
        return <>(
            <>
                <Head>
                    <title>Employee Management</title>
                </Head>
                <div className="relative">
                    <div className="absolute inset-0 h-screen flex">
                        <div className="m-auto">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-400"></div>
    
                        </div>
                    </div>
                </div>
            </>
           
        )</>
    }

    if(!user){
        router.push('/auth');
    }
    return null;
}

export default LoadingScreen