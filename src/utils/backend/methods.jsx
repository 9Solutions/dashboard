import axios from "axios";

const endpoint = process.env.REACT_APP_BACKEND_ENDPOINT;
const { token } = JSON.parse(sessionStorage.getItem("auth")) || {};
const api = axios.create({
    //baseURL: endpoint,
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

export const getProdutos = async () => {
    return api.get(`/produtos/?condicao=1`);
}

export const getCategorias = async () => {
    return api.get(`/categorias/`);
}

export const getCategoriasFiltradas = async (estagio) => {
    return api.get(`/categorias/filter?estagio=${estagio}&condicao=1`);
}

export const getFaixasEtarias = async () => {
    return api.get(`/faixa-etaria/`);
}

export const postProduto = async (produto) => {
    return api.post(`/produtos`, produto);
}

export const putProduto = async (id, produto) => {
    return api.put(`/produtos/${id}`, produto);
}

export const delProduto = async (id) => {
    return api.patch(`/produtos?id=${id}&condicao=0`);
}