import axios from "axios";

const endpoint = process.env.REACT_APP_BACKEND_ENDPOINT;
const { token } = JSON.parse(sessionStorage.getItem("auth")) || {};
const api = axios.create({
    baseURL: "http://10.0.0.164:8080",
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

export const getPedidoDetalhado = async (id) => {
    return api.get(`/pedidos/all-details/${id}`);
}

export const getCaixasEntregar = async () => {
    return api.get(`/dashboard/caixas-para-entregar`);
}

export const getCaixasMontar = async () => {
    return api.get(`/dashboard/caixas-em-montagem`);
}

export const getCaixasAtrasadas = async () => {
    return api.get(`/dashboard/caixas-atrasadas`);
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

export const getStatusCaixas = async () => {
    return api.get(`/status-caixa`);
}

export const patchCaixaStatus = async (idCaixa, status) => {
    return api.patch(`/caixas?idCaixa=${idCaixa}&status=${status}`);
}

export const getCaixaByQrCodeToken = async (qrCodeToken) => {
    return api.get(`/caixas/buscar-por-qrcode/${qrCodeToken}`);
}

export const postFoto = async (foto) => {
    const formData = new FormData();
    formData.append("image", foto);
    return api.post(`/fotos/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export const postFotoEmail = async (foto, id) => {
    const formData = new FormData();
    formData.append("image", foto);
    return api.post(`/fotos/upload-email/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export const getDoadores = async (permissaoAdmin) => {
    return api.get(`/doadores/usuarios/${permissaoAdmin}`);
}

export const postDoador = async (email,
                                 senha,
                                 permissaoAdmin) => {
    return api.post(`/doadores`, {
        nomeCompleto: "User Default",
        identificador: "30893795038",
        email,
        telefone: "11925566157",
        senha,
        permissao: permissaoAdmin
    });
}

export const getExportarCsv = async (tipo) => {
    // return bytes file for download
    return api.get(`/pedidos/exportar-csv`, { responseType: "blob" });
}

export const getExportarTxt = async (nomeAdmin) => {
    return api.get(`/pedidos/exportar-txt?nomeAdmin=${nomeAdmin}`, { responseType: "blob" });
}

export const postPDF = async (pedido) => {
    return api.post(`/lambda-services/live/generate-pdf`, pedido);
}

export const postImage = async (fotoBase64) => {
    return api.post(`/lambda-services/live/upload-image`, fotoBase64);
}

export const postImport = async (fileConfig) => {
    return api.post(`/lambda-services/live/imports`, fileConfig);
}

export const postImportTxt = async (file) => {
    return api.post(`/pedidos/import`, {
            file
        },
        {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }
    )
}

