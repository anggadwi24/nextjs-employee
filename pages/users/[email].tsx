import React, { useState } from 'react'
import { GetServerSideProps,NextPage } from 'next'
import api from '@/lib/api'
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import Main from '@/components/Layouts/Main';
import Input from '@/components/Input';
import Label from '@/components/Label';
import Error from '@/components/Label/error';
import Select from '@/components/Select';
type Props = {
  user:any
}

const Edit = ({user}: Props) => {
  
  const router = useRouter();
  const {email} = router.query;
  const breadcrumb = [{ name: "User", url: "/users" }, { name: "Edit", url: `/users/${email}` }];
  const [name, setName] = useState(user.name);
  const [emails, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user.role);
  const [loading,setLoading] = useState(false);
  const token = getCookie('token');
  const [message,setMessage] = useState('');
  const [success,setSuccess] = useState('');
  const [error,setError] = useState([]); 
  const submitHandle = (event : any) => {
    event.preventDefault();
    
    const data = {name,email:emails,role,password};
    setLoading(true);
    api.defaults.headers.Authorization = `Bearer ${token}`
    api
    .put(`/users/${email}`,data)
    .then((res) =>{
        
        setLoading(false)
        setMessage('');
        setSuccess(res.data.message)
        setRole('employee')
        setPassword('');
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
    <Main title={"Users"} breadcrumb={breadcrumb} page={"Users"}>
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
                <div className="grid gap-6 mb-6 md:grid-cols-2 mx-4">
                    <div>
                        <Label className=''>Name</Label>
                        <Input disabled={loading ? true : false} type="text" placeholder={"Insert name"} className={error && error.name ? `bg-red-50 border-red-500 text-red-800` : ``} value={name} onChange={(e) => setName(e.target.value)} />
                        <Error errors={error && error.name ? error.name : []}/>
                    </div>
                    <div>
                        <Label className=''>Email</Label>
                        <Input disabled={loading ? true : false} type="text" placeholder={"Insert email"} className={error && error.name ? `bg-red-50 border-red-500 text-red-800` : ``} value={emails} onChange={(e) => setEmail(e.target.value)} />
                        <Error errors={error && error.email ? error.email : []}/>

                    </div>
                    <div>
                        <Label className=''>Role</Label>
                        <Select className={error && error.role ? `bg-red-50 border-red-500 text-red-800` : ``} disabled={loading ? true : false} onChange={(e) => setRole(e.target.value)} value={role} >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </Select>
                        <Error errors={error && error.role ? error.role : []}/>
                    </div>
                    <div>
                        <Label className=''>Password</Label>
                        <Input disabled={loading ? true : false} type="password" placeholder={"Insert password"} value={password} className={error && error.password ? `bg-red-50 border-red-500 text-red-800` : ``} onChange={(e) => setPassword(e.target.value)} />
                        <Error errors={error && error.password ? error.password : []}/>
                    </div>
                </div>
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
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                }
            </form>
        </Main>
  )
}

export default Edit

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const token = context.req.cookies.token;
  const email = context.params.email;
  api.defaults.headers.Authorization = `Bearer ${token}`
  
  
  const data = await api.get(`/users/${email}`)
  
  return {
    props :{
      user:data.data.data
    },
  }
   
  }