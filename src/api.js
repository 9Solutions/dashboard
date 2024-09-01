import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: REACT_APP_API_URL
})

export default api;