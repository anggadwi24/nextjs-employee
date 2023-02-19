import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Main from '@/components/Layouts/Main';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  let breadcrumb : any;
  return (
    <>
        <Main title={'Dashboard'} breadcrumb={breadcrumb} page={'Dashboard'}>
          <div></div>
        </Main>
    </>
  )
}
