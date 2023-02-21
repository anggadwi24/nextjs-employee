import Main from "@/components/Layouts/Main";
import React, { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from 'next'
import useSWR, { mutate } from "swr";
import axios from "axios";
import Link from "next/link";
import api from "@/lib/api";
import { useRouter } from "next/router";
import { getCookie } from 'cookies-next';
type Props = {}

const token = getCookie('token');
const fetcher = (url: any) => axios.get(url, { headers: { Authorization: "Bearer " + token } }).then(res => res.data)
const Index = (props: Props) => {

    const router = useRouter();

    let getPage  = router.query?.page || 1
    const [page, setPage] = useState<number>(+getPage);
    const [success, setSuccess] = useState(null);
    const [errors, setError] = useState([]);
    const [loading, setLoading] = useState(false);
    const { data, error, mutate } = useSWR([`${process.env.NEXT_PUBLIC_BACKEND_URL}/employee?page=${page}`], fetcher);
    const user = data ? data.data.data : null;
    const datas = data ? data.data : null;
    const deleteData = (email: string) => {
        api.defaults.headers.Authorization = `Bearer ${token}`
        api
            .delete(`/employee/${email}`, data)
            .then((res) => {

                setSuccess(res.data.message);
                mutate(data);
            })
            .catch(err => {
                if (err.response.status) {

                    setError(err.response.data.data.error);

                }
                setLoading(false)
            })
    }

    useEffect(() => {

      
        const setPage = () =>{
            router.push({ pathname: '/employee', query: { page } })
          }
          setPage();
    }, [page])

    const breadcrumb = [{ name: "Employee", url: "/employee" }];
    return (
        <>
            <Main title={"Employee"} breadcrumb={breadcrumb} page={"Employee"}>
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
                <div className="justify-start mb-4 ">
                    <Link href={'/employee/add'} className="flex w-32">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg> Add
                    </Link>
                </div>
                <div className="relative overflow-x-auto ">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    NIP
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Balance
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
                            {data && user.map((value: any) => {
                                return (
                                    <tr key={value.nip} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th
                                            scope="row"
                                            className="px-6 py-4"
                                        >
                                            {value.nip}
                                        </th>
                                        <td className="px-6 py-4">{value.fullname}</td>
                                        <td className="px-6 py-4 uppercase">{value.balance}</td>
                                        <td className="px-6 py-4 flex justify-start">
                                            <Link href={`/employee/${value.email}`} className="text-sm" title="Edit Employee">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                                </svg>
                                            </Link>
                                            <Link href="" onClick={() => deleteData(value.email)} className="text-sm ml-3 text-red-500" title="Delete Employee" >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>

                                            </Link>
                                            <Link href={`/employee/balance/${value.email}`} className="text-sm ml-3 text-yellow-500" title="Leave Balance">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                                </svg>

                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}


                        </tbody>
                    </table>
                    <div className="flex justify-end mt-5 mr-4">
                        {datas && datas.prev_page_url &&
                            <Link href="" onClick={ () => setPage(page-1)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                Previous
                            </Link>
                        }
                        {datas && datas.next_page_url &&
                            <Link href="" onClick={ () => setPage(page+1)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
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
        </>


    )
}


export default Index