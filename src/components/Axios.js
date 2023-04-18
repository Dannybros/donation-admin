import axios from 'axios'

const instance = axios.create({
    baseURL:'https://donation-server.vercel.app', //http://localhost:8000
})

instance.interceptors.request.use((req)=>{
    if(localStorage.getItem('AuthToken')){
        req.headers['authorization'] = `Bearer ${localStorage.getItem('AuthToken')}`;
    }
    return req;
})

export default instance;
