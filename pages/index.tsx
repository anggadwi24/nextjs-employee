import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Main from '@/components/Layouts/Main';
import { useAuth } from '@/context/auth';
import api from "@/lib/api";
import { useRouter } from "next/router";
import { getCookie } from 'cookies-next';
import axios from 'axios';
import useSWR, { mutate } from "swr";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Error from '@/components/Label/error';

const inter = Inter({ subsets: ['latin'] })
const token = getCookie('token');
const fetcher = (url: any) => axios.get(url, { headers: { Authorization: "Bearer " + token } }).then(res => res.data)

export default function Home() {
  let breadcrumb: any;
  const { user } = useAuth();
  if (user && user.role === 'admin') {
    const { data: employee, error: errorsx } = useSWR([`${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/dropdown`], fetcher);
    const { data: users, error: errorsxx } = useSWR([`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/dropdown`], fetcher);
    const { data, error, mutate } = useSWR([`${process.env.NEXT_PUBLIC_BACKEND_URL}/balance?isApprove=null`], fetcher);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [errors, setError] = useState([]);
    const balance = data ? data.data.data : null;
    const datas = data ? data.data : null;

    const handleSubmission = (id: any, status: any) => {
      api.defaults.headers.Authorization = `Bearer ${token}`
      api
        .post(`/balance/submission/${id}/${status}`)
        .then((res) => {

          setLoading(false)

          setSuccess(res.data.message)
          mutate(data);




        })
        .catch(err => {
          if (err.response.status) {
            setError(err.response.data.data);

          }
          setLoading(false)
        })

    }
    return (
      <>
        <Main title={'Dashboard'} breadcrumb={breadcrumb} page={'Dashboard'}>

          <div className='flex justify-start'>
            <div className=" p-3 w-64 mx-3 bg-green-100 border border-green-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-center">
              <span className="text-5xl font-extrabold tracking-tight">{users && users.data.length}{!users && 'Loading'}</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">users</span>
            </div>
            <div className="p-3  w-64 mx-3 bg-indigo-100 border border-indigo-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-center">
              <span className="text-5xl font-extrabold tracking-tight">{employee && employee.data.length}{!employee && 'Loading'}</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">employee</span>
            </div>
          </div>

          <div className="relative overflow-x-auto mt-4">
            <h3 className='text-xl font-medium my-2'>Leave Balance Waiting</h3>
            {errors && errors.length > 0 &&
              <div className="mt-4 p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                <span className="font-medium">Warning!</span> {errors[0]}
              </div>
            }
            {success &&
              <div className="mt-4 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-300" role="alert">
                <span className="font-medium">Success!</span> {success}
              </div>
            }
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>

                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Balance
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Flow
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Approve
                  </th>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                </tr>
              </thead>
              <tbody>
                {!data &&
                  <tr>
                    <td colSpan={5} className="text-center">Loading....</td>
                  </tr>
                }
                {data && balance.length > 0 && balance.map((value: any) => {
                  return (
                    <tr key={value.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">

                      <td className="px-6 py-4">{value.fullname}</td>
                      <td className="px-6 py-4 uppercase">{value.dates}</td>
                      <td className="px-6 py-4 uppercase">{value.balance}</td>
                      <td className="px-6 py-4 uppercase">{value.flow}</td>
                      <td className="px-6 py-4 uppercase">{value.approve}</td>



                      <td className="px-6 py-4 flex justify-start">
                        {!value.isApprove &&
                          <>
                            <Link href={``} onClick={() => handleSubmission(value.id, 'approve')} className="text-sm" title="Approve Submission">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>

                            </Link>
                            <Link href={``} onClick={() => handleSubmission(value.id, 'disapprove')} className="text-sm" title="Disapprove Submission">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>


                            </Link>
                          </>


                        }



                      </td>
                    </tr>
                  )
                })}
                {data && balance.length === 0 &&
                  <tr>
                    <td colSpan={5} className="text-center">No Data</td>
                  </tr>
                }


              </tbody>
            </table>

            {loading &&
              <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                <span className="sr-only">Loading...</span>
              </div>

            }

          </div>
        </Main>
      </>
    )
  } else {
    const router = useRouter();
    let getPage = router.query?.page || 1
    const [page, setPage] = useState<number>(+getPage);
    const { data: profile, error: errorsx } = useSWR([`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`], fetcher);
    const { data, error: errorsxz, mutate } = useSWR([`${process.env.NEXT_PUBLIC_BACKEND_URL}/history?page=${page}`], fetcher);
    const [loading, setLoading] = useState(false);

    const balance = data ? data.data.data : null;
    const datas = data ? data.data : null;
    const [balances, setBalance] = useState(0);
    const [message, setMessage] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');


    const submitHandle = (event: any) => {
      event.preventDefault();
      api.defaults.headers.Authorization = `Bearer ${token}`
      api
        .post(`/submission`, { balance: balances })
        .then((res) => {

          setLoading(false)
          setBalance(0);
          setSuccess(res.data.message)

          setError('');




        })
        .catch(err => {
          if (err.response.status) {
            setError(err.response.data.data.error);
            setSuccess('');
            setMessage(err.response.data.data);


          }
          setLoading(false)
        })
    }
    useEffect(() => {

      router.push({ pathname: '/', query: { page } })
    }, [page])

    return (
      <Main title={'Dashboard'} breadcrumb={breadcrumb} page={'Dashboard'}>
        <div className='flex justify-start'>
          <h3 className='text-2xl'>Balance : {profile && profile.data.balance} {!profile && 'Loading...'}</h3>
        </div>
        <form onSubmit={submitHandle}>
          {error &&
            <div className="mt-4 p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
              <span className="font-medium">Warning!</span> {error}
            </div>
          }
          {success &&
            <div className="mt-4 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-300" role="alert">
              <span className="font-medium">Success!</span> {success}
            </div>
          }
          <div className='grid gap-1 mb-2 md:grid-cols-1 my-5'>
            <h6 className='text-xl font-medium'>Submission leave balance</h6>
            <div className="grid gap-8 mb-6 md:grid-cols-4">

              <div>
                <Label className=''>Balance</Label>
                <Input disabled={loading ? true : false} type="number" placeholder={"Insert Leave Balance"} className={message && message.balance ? `bg-red-50 border-red-500 text-red-800` : ``} value={balances} onChange={(e) => setBalance(e.target.value)} />
                <Error errors={message && message.balance ? message.balance : []} />

              </div>
              <div>
                {loading &&
                  <button disabled type="button" className="text-white mt-8 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                    Loading...
                  </button>
                }
                {!loading &&
                  <button type="submit" className=" text-white bg-blue-700 mt-7 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                }
              </div>
            </div>
          </div>
        </form>
        {loading &&
          <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
            <span className="sr-only">Loading...</span>
          </div>

        }
        <div className="relative overflow-x-auto mt-10 ">
          <h1 className='text-xl font-medium'>History Balance</h1>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>


                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3">
                  Flow
                </th>
                <th scope="col" className="px-6 py-3">
                  Approve
                </th>

              </tr>
            </thead>
            <tbody>
              {!data &&
                <tr>
                  <td colSpan={5} className="text-center">Loading....</td>
                </tr>
              }
              {data && balance.length > 0 && balance.map((value: any) => {
                return (
                  <tr key={value.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">


                    <td className="px-6 py-4 uppercase">{value.dates}</td>
                    <td className="px-6 py-4 uppercase">{value.balance}</td>
                    <td className="px-6 py-4 uppercase">{value.flow}</td>
                    <td className="px-6 py-4 uppercase">{value.approve}</td>




                  </tr>
                )
              })}


            </tbody>
          </table>
          <div className="flex justify-end mt-5 mr-4">
            {datas && datas.prev_page_url &&
              <Link href="" onClick={() => setPage(page - 1)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                Previous
              </Link>
            }
            {datas && datas.next_page_url &&
              <Link href="" onClick={() => setPage(page + 1)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                Next
              </Link>
            }

          </div>
          {loading &&
            <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
              <span className="sr-only">Loading...</span>
            </div>

          }

        </div>
      </Main>
    )
  }






}
