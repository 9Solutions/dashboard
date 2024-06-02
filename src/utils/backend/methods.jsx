import axios from "axios";

const endpoint = process.env.REACT_APP_BACKEND_ENDPOINT;
const token = sessionStorage.getItem("auth");
const api = axios.create({
    baseURL: endpoint,
    headers: {
        Authorization: token ? `Bearer ${token}` : null
    }
});

export const login = async (email, senha) => {
    if(email.length === 0 || senha.length === 0) return;
    return api.post(`/doadores/login`, {"email": email, "senha": senha});
}

export const logout = () => {
    sessionStorage.removeItem("auth");
    window.location.href = "/";
}

export const getAllDoacoes = async () => {
    return api.get(`/pedidos`);
}