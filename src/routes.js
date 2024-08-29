import React from "react";
import { Route, BrowserRouter, Routes} from "react-router-dom";

import HistoricoDoacoes from "./utils/pages/historicoDoacoes/HistoricoDoacoes";
import Login from "./utils/pages/login/Login";
import Doacoes from "./utils/pages/doacoes/Doacoes";
import Logout from "./utils/pages/logout/Logout";
import Produtos from "./utils/pages/produtos/Produtos";
import QrCode from "./utils/pages/qrCode/QrCode";
import CadastroUsuarios from "./utils/pages/cadastrar-usuarios/CadastroUsuarios"

const rotas = () => {
   return(
       <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>} exact />
                <Route path="/doacoes" element={<Doacoes/>} exact />
                <Route path="/historico-doacoes" element={<HistoricoDoacoes/>} exact />
                <Route path="/itens-doacao" element={<Produtos/>} exact />
                <Route path="/logout" element={<Logout/>} exact />
                <Route path="/qr-code" element={<QrCode/>} exact />
                <Route path="/cadastro-usuarios" element={<CadastroUsuarios/>} exact />
            </Routes>
       </BrowserRouter>
   )
}

export default rotas;