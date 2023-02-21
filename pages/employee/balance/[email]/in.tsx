import React, { useEffect, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import useSWR, { mutate } from "swr";
import Main from '@/components/Layouts/Main';
import Link from 'next/link';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Error from '@/components/Label/error';


type Props = {
  employee: any
}
const token = getCookie('token');
const fetcher = (url: any) => axios.get(url, { headers: { Authorization: "Bearer " + token } }).then(res => res.data)
const Detail = ({ employee }: Props) => {
  const router = useRouter();

  const [page, setPage] = useState(router.query?.page || 1);
  const { email } = router.query;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [balances, setBalance] = useState(0);
  const [show,setShow] = useState(employee.balance);
  const [message, setMessage] = useState([]);

  const breadcrumb = [{ name: "Employee", url: "/employee" }, { name: 'Leave Balance', url: `/employee/balance/${email}` }, { name: 'In', url: `/employee/balance/${email}/in` }];

  const submitHandle = (event: any) => {
    event.preventDefault();
    api.defaults.headers.Authorization = `Bearer ${token}`
    api
      .post(`/balance/in/${email}`,{balance:balances})
      .then((res) => {
        
        setLoading(false)
        setBalance(0);
        setSuccess(res.data.message)
        setShow(res.data.data.balance);
        setError('');



      })
      .catch(err => {
        if (err.response.status) {
          setError(err.response.data.data);
          setSuccess('');
          setMessage(err.response.data.data);
        }
        setLoading(false)
      })

  }

  return (
    <Main title={"Leave Balance"} breadcrumb={breadcrumb} page={"Leave Balance"}>

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
            <label className='text-gray-800 text-sm'>Employee Balance</label>
            <h3 className='font-medium text-xl mt-0'>{show}</h3>
          </div>
        </div>
        <div className="relative w-3/4 overflow-x-auto ">
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
          <form onSubmit={submitHandle}>
            <div className='grid gap-1 mb-2 md:grid-cols-1 mx-4'>
              <div className="grid gap-6 mb-6 md:grid-cols-2 mx-4">

                <div>
                  <Label className=''>Balance</Label>
                  <Input disabled={loading ? true : false} type="number" placeholder={"Insert In Balance"} className={error && error.balance ? `bg-red-50 border-red-500 text-red-800` : ``} value={balances} onChange={(e) => setBalance(e.target.value)} />
                  <Error errors={message && message.balance ? message.balance : []} />

                </div>
                <div>
                {loading && 
                    <button disabled type="button" className="text-white mt-8 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
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
        </div>


      </div>
    </Main>
  )
}

export default Detail
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const token = context.req.cookies.token;
  const email = context.params.email;
  api.defaults.headers.Authorization = `Bearer ${token}`


  const data = await api.get(`/employee/${email}`)

  return {
    props: {
      employee: data.data.data
    },
  }

}