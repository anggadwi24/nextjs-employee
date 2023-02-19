import Axios from "axios";


const api = Axios.create({
    baseURL:process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
    },
 
});

export default api;