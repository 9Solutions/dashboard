import axios from "axios";

const endpoint = process.env.REACT_APP_BACKEND_ENDPOINT;
const { token } = JSON.parse(sessionStorage.getItem("auth")) || {};
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

export const getDoacaoFiltro = async (status, data, idPedido) => {
    return api.get(`/pedidos/filter`, { params: { status, data, idPedido } });
}

export const getAllDoacoesDetalhadas = async () => {
    return api.get(`/pedidos/all-details`);
}

export const getCaixasEntregar = async () => {
    return api.get(`/vw-caixas-para-entregar`);
}

export const getCaixasMontar = async () => {
    return api.get(`/vw-caixas-em-montagem`);
}

export const getCaixasAtrasadas = async () => {
    return api.get(`/vw-caixas-atrasadas`);
}