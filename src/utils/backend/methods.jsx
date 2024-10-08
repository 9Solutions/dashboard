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
    return api.post(`/java-api/doadores/login`, {"email": email, "senha": senha});
}

export const logout = () => {
    sessionStorage.removeItem("auth");
    window.location.href = "/";
}

export const getAllDoacoes = async () => {
    return api.get(`/java-api/pedidos`);
}

export const getDoacaoFiltro = async (status, data, idPedido) => {
    return api.get(`/java-api/pedidos/filter`, { params: { status, data, idPedido } });
}

export const getPedidoDetalhado = async (id) => {
    return api.get(`/java-api/pedidos/all-details/${id}`);
}

export const getCaixasEntregar = async () => {
    return api.get(`/java-api/dashboard/caixas-para-entregar`);
}

export const getCaixasMontar = async () => {
    return api.get(`/java-api/dashboard/caixas-em-montagem`);
}

export const getCaixasAtrasadas = async () => {
    return api.get(`/java-api/dashboard/caixas-atrasadas`);
}

export const getProdutos = async () => {
    return api.get(`/java-api/produtos/?condicao=1`);
}

export const getCategorias = async () => {
    return api.get(`/java-api/categorias/`);
}

export const getCategoriasFiltradas = async (estagio) => {
    return api.get(`/java-api/categorias/filter?estagio=${estagio}&condicao=1`);
}

export const getFaixasEtarias = async () => {
    return api.get(`/java-api/faixa-etaria/`);
}

export const postProduto = async (produto) => {
    return api.post(`/java-api/produtos`, produto);
}

export const putProduto = async (id, produto) => {
    return api.put(`/java-api/produtos/${id}`, produto);
}

export const delProduto = async (id) => {
    return api.patch(`/java-api/produtos?id=${id}&condicao=0`);
}

export const getStatusCaixas = async () => {
    return api.get(`/java-api/status-caixa`);
}

export const patchCaixaStatus = async (idCaixa, status) => {
    return api.patch(`/java-api/caixas?idCaixa=${idCaixa}&status=${status}`);
}

export const getCaixaByQrCodeToken = async (qrCodeToken) => {
    return api.get(`/java-api/caixas/buscar-por-qrcode/${qrCodeToken}`);
}

export const postFoto = async (foto) => {
    const formData = new FormData();
    formData.append("image", foto);
    return api.post(`/java-api/fotos/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export const postFotoEmail = async (foto, id) => {
    const formData = new FormData();
    formData.append("image", foto);
    return api.post(`/java-api/fotos/upload-email/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export const postPDF = async (pedido) => {
    return api.post(`/lambda-services/live/teste`, pedido);
}

export const postImage = async (fotoBase64) => {
    return api.post(`/lambda-services/live/foto`, fotoBase64);
}