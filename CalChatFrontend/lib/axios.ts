//import axios from "axios"

//const api = axios.create({
//    baseURL: "https://calchatmain.runasp.net/api"
//})

//api.interceptors.request.use((config) => {

//    const token = localStorage.getItem("token")

//    if (token) {
//        config.headers.Authorization = `Bearer ${token}`
//    }

//    return config
//})


//import axios from "axios"

//const BASE_URL = process.env.NEXT_PUBLIC_API_URL

//if (!BASE_URL) {
//    throw new Error("NEXT_PUBLIC_API_URL is not defined ❌")
//}

//const api = axios.create({
//    baseURL: BASE_URL,
//    timeout: 10000, // 🔥 10 seconds max wait
//    headers: {
//        "Content-Type": "application/json"
//    }
//})

//api.interceptors.request.use((config) => {
//    const token = localStorage.getItem("token")

//    if (token) {
//        config.headers = config.headers || {}
//        config.headers.Authorization = `Bearer ${token}`
//    }

//    return config
//})

//export default api


import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined ❌")
}

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // ✅ 30 sec
    headers: {
        "Content-Type": "application/json"
    }
})

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.code === "ECONNABORTED") {
            alert("Server waking up ⏳ Please try again")
        }
        return Promise.reject(error)
    }
)

export default api