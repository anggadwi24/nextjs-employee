import Main from '@/components/Layouts/Main';
import React, { useState } from 'react'
import axios from 'axios';
import Input from '@/components/Input';
import Label from '@/components/Label';
import Error from '@/components/Label/error';
import Select from '@/components/Select';
import useSWR, { mutate } from "swr";
import { getCookie } from 'cookies-next';
import api from '@/lib/api';
import Textarea from '@/components/Input/textarea';
type Props = {}
const token = getCookie('token');
const fetcher = (url: any) => axios.get(url, { headers: { Authorization: "Bearer " + token } }).then(res => res.data)
const Add = (props: Props) => {
    const breadcrumb = [{ name: "Employee", url: "/employee" }, { name: 'Add', url: '/employee/add' }];
    const { data: user, error:errors, mutate } = useSWR([`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/dropdown?role=employee`], fetcher);
    const [usersId, setUserID] = useState('');
    const [nip, setNIP] = useState('');
    const [fullname, setFullname] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [pob, setPOB] = useState('');
    const [dob, setDOB] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState([]);
    const [success, setSuccess] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const users = user ? user.data : [];
    const date = new Date();
    date.setFullYear( date.getFullYear() - 17);
    const month  =(date.getMonth() + 1).toString().padStart(2, "0");
    const max = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    const submitHandle = (event: any) => {
        event.preventDefault();
        const data = {users_id:usersId,nip,fullname,gender,phone,pob,dob,address};
        setLoading(true);
        api.defaults.headers.Authorization = `Bearer ${token}`
        api
        .post(`/employee`,data)
        .then((res) =>{
            
            setLoading(false)
            setMessage('');
            setSuccess(res.data.message)
            setUserID('')
            setFullname('')
            setGender('')
            setPhone('')
            setPOB('')
            setDOB('')
            setAddress('')
            setError([]);
           

            
         })
         .catch(err => {
            if(err.response.status){
                setError(err.response.data.data);
                setMessage(err.response.data.message);
              }
              setLoading(false)
         })
    }

    return (
        <Main title={"Employee"} breadcrumb={breadcrumb} page={"Employee"}>
            {message &&
                <div className="mt-4 p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                    <span className="font-medium">Warning!</span> {message}
                </div>
            }
            {success &&
                <div className="mt-4 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-300" role="alert">
                    <span className="font-medium">Success!</span> {success}
                </div>
            }
            <form onSubmit={submitHandle}>
                <div className='grid gap-1 mb-2 md:grid-cols-1 mx-4'>
                    <div>
                        <Label className=''>Users</Label>
                        <Select className={error && error.users_id ? `bg-red-50 border-red-500 text-red-800` : ``} disabled={loading ? true : false} onChange={(e) => setUserID(e.target.value)} value={usersId} >
                            {users &&
                                <option value="">Select Users</option>
                            }
                            {users && users.length > 0 && users.map((value: any) => {
                                return (
                                    <option value={value.id} key={value.id}>
                                        {value.email}
                                    </option>
                                )

                            })}
                            {!users &&
                                <option value="">Loading....</option>

                            }
                        </Select>
                        <Error errors={error && error.users_id ? error.users_id : []} />

                    </div>
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2 mx-4">

                    <div>
                        <Label className=''>NIP</Label>
                        <Input disabled={loading ? true : false} type="number" placeholder={"Insert NIP"} className={error && error.nip ? `bg-red-50 border-red-500 text-red-800` : ``} value={nip} onChange={(e) => setNIP(e.target.value)} />
                        <Error errors={error && error.nip ? error.nip : []} />

                    </div>
                    <div>
                        <Label className=''>Fullname</Label>
                        <Input disabled={loading ? true : false} type="text" placeholder={"Insert Fullname"} className={error && error.fullname ? `bg-red-50 border-red-500 text-red-800` : ``} value={fullname} onChange={(e) => setFullname(e.target.value)} />
                        <Error errors={error && error.fullname ? error.fullname : []} />
                    </div>
                    <div>
                        <Label className=''>Phone</Label>
                        <Input disabled={loading ? true : false} type="number" placeholder={"Insert Phone"} className={error && error.phone ? `bg-red-50 border-red-500 text-red-800` : ``} value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <Error errors={error && error.nip ? error.nip : []} />

                    </div>
                    <div>
                        <Label className=''>Gender</Label>
                        <Select className={error && error.role ? `bg-red-50 border-red-500 text-red-800` : ``} disabled={loading ? true : false} onChange={(e) => setGender(e.target.value)} value={gender} >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </Select>
                        <Error errors={error && error.gender ? error.gender : []} />
                    </div>
                    <div>
                        <Label className=''>Place of Birth</Label>
                        <Input disabled={loading ? true : false} type="text" placeholder={"Insert Place of Birth"} className={error && error.pob ? `bg-red-50 border-red-500 text-red-800` : ``} value={pob} onChange={(e) => setPOB(e.target.value)} />
                        <Error errors={error && error.pob ? error.pob : []} />
                    </div>
                    <div>
                        <Label className=''>Date of Birth</Label>
                        <Input disabled={loading ? true : false} max={date.getFullYear() + '-' + month + '-' + date.getDate()} type="date" placeholder={"Insert Date of Birth"} className={error && error.dob ? `bg-red-50 border-red-500 text-red-800` : ``} value={dob} onChange={(e) => setDOB(e.target.value)} />
                        <Error errors={error && error.dob ? error.dob : []} />
                    </div>
                   
                </div>
                <div className='grid gap-1 mb-2 md:grid-cols-1 mx-4'>
                    <div>
                        <Label className=''>Address</Label>
                        <Textarea disabled={loading ? true : false}  placeholder={"Insert Address"} className={error && error.address ? `bg-red-50 border-red-500 text-red-800` : ``} value={address} onChange={(e) => setAddress(e.target.value)} />
                        <Error errors={error && error.address ? error.address : []} />

                    </div>
                </div>
                <div className='flex justify-end mx-4 my-4'>

               
                {loading && 
                    <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    Loading...
                </button>
                }
                {!loading && 
                <button type="submit" className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                }
                 </div>
            </form>
        </Main>
    )
}

export default Add