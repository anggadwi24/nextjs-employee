import React, { useEffect, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import useSWR, { mutate } from "swr";
import Main from '@/components/Layouts/Main';
import Link from 'next/link';


type Props = {
    employee: any
}
const token = getCookie('token');
const fetcher = (url: any) => axios.get(url, { headers: { Authorization: "Bearer " + token } }).then(res => res.data)
const Detail = ({ employee }: Props) => {
    const router = useRouter();
    let getPage  = router.query?.page || 1
    const [page, setPage] = useState<number>(+getPage);
    const { email } = router.query;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    const breadcrumb = [{ name: "Employee", url: "/employee" }, { name: 'Leave Balance', url: `/employee/balance/${email}` }];
    const { data: data, error: errors, mutate } = useSWR([`${process.env.NEXT_PUBLIC_BACKEND_URL}/balance/employee/${email}?page=${page}`], fetcher);
    const balance = data ? data.data.data : null;
    const datas = data ? data.data : null;
    const handleSubmission = (id: any, status: any) => {
        api.defaults.headers.Authorization = `Bearer ${token}`
        api
            .post(`/balance/submission/${id}/${status}`)
            .then((res) => {

                setLoading(false)

                setSuccess(res.data.message)
                mutate(balance);




            })
            .catch(err => {
                if (err.response.status) {
                    setError(err.response.data.data);

                }
                setLoading(false)
            })

    }
    useEffect(() => {
        const setPage = () =>{
           
            router.push({ pathname: `/employee/balance/${email}`, query: { page } })
          }
          setPage();
       
    }, [page,email])
    return (
        <Main title={"Leave Balance"} breadcrumb={breadcrumb} page={"Leave Balance"}>
            <div className='flex justify-end mx-4 mb-4'>
                <Link href={`/employee/balance/${email}/in`} className="mr-3" title='Balance In'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                    </svg>

                </Link>
                <Link href={`/employee/balance/${email}/out`} title="Balance Out">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                </Link>

            </div>
            <div className="relative flex justify-content-between">
                <div className='w-1/4 grid grid-cols-1 gap-3 bg-gray-100 p-3 mr-3'>
                    <div>
                        <label className='text-gray-800 text-sm'>Employee NIP</label>
                        <h3 className='font-medium text-xl mt-0'>{employee.nip}</h3>
                    </div>
                    <div>
                        <label className='text-gray-800 text-sm'>Employee name</label>
                        <h3 className='font-medium text-xl mt-0'>{employee.fullname}</h3>
                    </div>
                    <div>
                        <label className='text-gray-800 text-sm'>Employee gender</label>
                        <h3 className='font-medium text-xl mt-0'>{employee.gender}</h3>
                    </div>
                    <div>
                        <label className='text-gray-800 text-sm'>Employee phone</label>
                        <h3 className='font-medium text-xl mt-0'>{employee.phone}</h3>
                    </div>
                    <div>
                        <label className='text-gray-800 text-sm'>Place, Birht date</label>
                        <h3 className='font-medium text-xl mt-0'>{employee.pob + ', ' + employee.dob}</h3>
                    </div>
                    <div>
                        <label className='text-gray-800 text-sm'>Employee address</label>
                        <h3 className='font-medium text-xl mt-0'>{employee.address}</h3>
                    </div>
                    <div>
                        <label className='text-gray-800 text-sm'>Employee balance</label>
                        <h3 className='font-medium text-xl mt-0'>{employee.balance}</h3>
                    </div>
                </div>
                <div className="relative w-3/4 overflow-x-auto ">
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


                                        <td className="px-6 py-4 uppercase">{value.dates}</td>
                                        <td className="px-6 py-4 uppercase">{value.balance}</td>
                                        <td className="px-6 py-4 uppercase">{value.flow}</td>
                                        <td className="px-6 py-4 uppercase">{value.approve}</td>



                                        <td className="px-6 py-4 flex justify-start">
                                            {!value.isApprove &&
                                                <>
                                                    <Link href={`/employee/balance/${email}`} onClick={() => handleSubmission(value.id, 'approve')} className="text-sm" title="Approve Submission">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-3">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>

                                                    </Link>
                                                    <Link href={`/employee/balance/${email}`} onClick={() => handleSubmission(value.id, 'disapprove')} className="text-sm" title="Disapprove Submission">
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


                        </tbody>
                    </table>
                    <div className="flex justify-end mt-5 mr-4">
                        {datas && datas.prev_page_url &&
                            <Link href={`/employee/balance/${email}`} onClick={ () => setPage(page-1)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                Previous
                            </Link>
                        }
                        {datas && datas.next_page_url &&
                            
                            <Link href={`/employee/balance/${email}`}  onClick={ () => setPage(page+1)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
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


            </div>
        </Main>
    )
}

export default Detail
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const token = context.req.cookies.token;
    const email = context.query.email;
    api.defaults.headers.Authorization = `Bearer ${token}`


    const data = await api.get(`/employee/${email}`)

    return {
        props: {
            employee: data.data.data
        },
    }

}