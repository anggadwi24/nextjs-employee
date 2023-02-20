import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ProtectRoute } from '../context/auth'
import { AuthProvider } from '../context/auth'


export default function App({ Component, pageProps }: AppProps) {
 
  return (
    <AuthProvider>
        <ProtectRoute>
            <Component {...pageProps} />
        </ProtectRoute>
      </AuthProvider>
  )
}
