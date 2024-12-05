import axios from "axios";

const { token } = JSON.parse(sessionStorage.getItem("auth")) || {};
const api = axios.create({
    headers: {
        Authorization: token ? `Bearer ${token}` : null
    }
});

export const login = async (email, senha) => {
    if (email.length === 0 || senha.length === 0) return;
    return api.post(`/java-api/doadores/login`, { "email": email, "senha": senha });
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

export const getDoadores = async (permissaoAdmin) => {
    return api.get(`/java-api/doadores/usuarios/${permissaoAdmin}`);
}

export const postDoador = async (email,
    senha,
    permissaoAdmin) => {
    return api.post(`/java-api/doadores`, {
        nomeCompleto: "User Default",
        identificador: "30893795038",
        email,
        telefone: "11925566157",
        senha,
        permissao: permissaoAdmin
    });
}
export const postDoadorLote = async (
    nomeCompleto,
    email,
    telefone,
    senha,
    permissaoAdmin) => {
    return api.post(`/java-api/doadores`, {
        nomeCompleto,
        identificador: "30893795038",
        email,
        telefone,
        senha,
        permissao: permissaoAdmin
    });
}
export const getExportarCsv = async (tipo) => {
    // return bytes file for download
    return api.get(`/java-api/pedidos/exportar-csv`, { responseType: "blob" });
}

export const getExportarTxt = async (nomeAdmin) => {
    return api.get(`/java-api/pedidos/exportar-txt?nomeAdmin=${nomeAdmin}`, { responseType: "blob" });
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
    return api.post(`java-api/pedidos/import`, {
        file
    },
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
}

export const postPedido = async (payload) => {
    return api.post('/java-api/pedidos', payload)
}

export const postCaixa = async (payload) => {
    return api.post('/java-api/caixas', payload)
}