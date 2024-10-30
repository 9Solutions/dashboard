import React from "react";
import styles from "./HistoricoDoacoes.module.css";
import LeftBar from "../../components/leftBar/LeftBar";
import Navbar from "../../components/navbar/Navbar";
import KPI from "../../components/kpi/KPI";
import importPic from "../../assets/import.png";
import exportPic from "../../assets/export.png";

import { useState, useEffect } from "react";
import {
    getAllDoacoes,
    getDoacaoFiltro,
    getPedidoDetalhado,
    getCaixasEntregar,
    getCaixasMontar,
    postPDF, postImport, getExportarTxt, getExportar
} from "../../backend/methods";
import {base64ToBlob, fileToBase64, tranformDate, tranformPhone} from "../../globals";
import { useSearchParams } from "react-router-dom";
import {toast} from "react-toastify";


const HistoricoDoacoes = () => {
    const [searchParams] = useSearchParams();

    const [doacoes, setDoacoes] = useState([]);
    const [qtdEntrega, setQtdEntrega] = useState([]);
    const [qtdMontar, setQtdMontar] = useState([]);

    const data = searchParams.get('data');
    const status = searchParams.get('status');
    const idDoacao = searchParams.get('idDoacao');
    const {nome} = JSON.parse(sessionStorage.getItem("auth"));

    const isSelected = (value) => status === value;


    const loadDoacoes = () => {
        if (searchParams.size === 3) {
            getDoacaoFiltro(status, data, idDoacao).then((response) => {
                let doacoes = response.data.reduce((acc, curr) => {
                    if (acc[curr.id]) {
                        acc[curr.id].quantidadeCaixas += 1;
                    } else {
                        acc[curr.id] = curr;
                        acc[curr.id].quantidadeCaixas = 1;
                    }
                    return acc;
                }, []);
                setDoacoes(doacoes);
            }).catch((error) => {
                console.error("Erro ao buscar as doações: ", error);
            })
        } else {
            getAllDoacoes().then((response) => {
                setDoacoes(response.data);
            }).catch((error) => {
                console.error("Erro ao buscar as doações: ", error);
            })
        }
    }



    const importFile = (selectedFile) => {
        if (!selectedFile) {
            alert("Por favor, selecione um arquivo CSV");
            return;
        }

        const extension = selectedFile.name.split('.').pop().toLowerCase();

        fileToBase64(selectedFile).then((base64) => {
            const formData = {
                file: base64,
                fileExtension: extension
            };
            let loadFile = toast.loading("Importando arquivo...");
            postImport(formData).then((response) => {
                toast.update(loadFile, {render: "Arquivo Importado", type: "success", isLoading: false, autoClose: true});
                window.location.reload();
            }).catch((error) => {
                console.error("Erro ao importar arquivo: ", error);
                toast.update(loadFile, {render: "Erro ao importar arquivo", type: "error", isLoading: false, autoClose: true});
            })
        });
    };

    const handleFileChange = (event) => {
        let selectedFile = event.target.files[0];
        importFile(selectedFile);
    };
      
    const loadQtdEntrega = () => {
        getCaixasEntregar().then((response) => {
            setQtdEntrega(response.data[0].qtdCaixasParaEntregar);
        }
        ).catch((error) => {
            console.error("Erro ao buscar as caixas para entrega: ", error);
        })
    }

    const loadQtdMontar = () => {
        getCaixasMontar().then((response) => {
            setQtdMontar(response.data[0].qtdCaixasEmMontagem);
        }
        ).catch((error) => {
            console.error("Erro ao buscar as caixas para montar: ", error);
        })
    }


    const getPDF = (idPedido, element) => {
        console.log(element)

        getPedidoDetalhado(idPedido).then((response) => {
            let pedido = response.data
            postPDF({
                "body": [pedido]
            }).then((responsePdf) => {
                const blob = new Blob([base64ToBlob(responsePdf.data.body)], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            }).catch((error) => {
                console.error("Erro ao buscar o PDF: ", error);
            })
        });
    }

    const exportar = (tipo) => {

    
        if (tipo === 'txt'){
            getExportarTxt(nome).then((response) => {
                const blob = new Blob([response.data], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'doacoes.txt';
                a.click();
            })
        }else {
            getExportar(tipo).then((response) => {
                const blob = new Blob([response.data], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `doacoes.${tipo}`;
                a.click();
            })
        }
    };
    




    useEffect(() => {
        loadDoacoes();

        loadQtdEntrega();

        loadQtdMontar();

    }, [data, status, idDoacao, searchParams.size]);

    return (
        <div style={{ display: "flex", alignItems: 'center', flexDirection: "column" }}>
            <LeftBar />
            <Navbar page_title="Histórico de Doações" />
            <div className={styles["kpi__container"]}>
                <KPI title="Caixas que precisam ser feitas" count={qtdMontar} />
                <KPI title="Caixas prontas para entrega" count={qtdEntrega} />
            </div>

            <div className={styles["relatorio__container"]}>
                <h1>Lista de Doações</h1>
                <div className={styles["botoes"]}>
                    <input 
                      type="file" 
                      accept=".xlsx, .txt"
                      onChange={handleFileChange} 
                      style={{ display: 'none' }} 
                      id="upload-csv"
                    />
                    <label htmlFor="upload-csv" className={styles["botao-import"]}>
                        <img src={importPic} alt="" />
                        Importar
                    </label>


                    <select className={styles["botao-export"]} onChange={e => exportar(e.target.value)}>
                        <img src={exportPic} alt=""/>
                        <option value="" selected={true} disabled={true}>Exportar</option>
                        <option value="csv">CSV</option>
                        <option value="json">Json</option>
                        <option value="xml">XML</option>
                        <option value="txt">TXT</option>
                    </select>

                </div>
                <div className={styles["filtro__container"]}>
                    <form className={styles["form__filtros"]} method="GET">
                        <div><label>Nº da Doação</label>
                            <input type="text" placeholder="000000" name="idDoacao" defaultValue={idDoacao} /></div>
                        <div><label>Data Doação</label>
                            <input type="date" name="data" defaultValue={data} /></div>
                        <div><label>Status</label>
                            <select name="status">
                                <option value="" selected={isSelected("")}>Todos</option>
                                <option value="Pronta para montagem" selected={isSelected("Pronta para montagem")}>Pronta para Montagem</option>
                                <option value="Pronta para entrega" selected={isSelected("Pronta para entrega")}>Pronta para Entrega</option>
                                <option value="Entregue" selected={isSelected("Entregue")}>Entregue</option>
                            </select>
                        </div>

                        <button type="submit">Filtrar</button>
                    </form>
                </div>

                <table className={styles["tabela"]}>
                    <thead>
                        <tr>
                            <th>Nº Doação</th>
                            <th>Doador</th>
                            <th>Telefone</th>
                            <th>Status</th>
                            <th>Data Doação</th>
                            <th>Valor</th>
                            <th>Caixas</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(doacoes.length === 0) ? <tr><td colSpan="8">Nenhuma doação encontrada</td></tr> :
                            doacoes.map((doacao, index) => (
                                <tr key={index}>
                                    <td>{doacao.id}</td>
                                    <td>{doacao.doador.nome || doacao.doador.nomeCompleto}</td>
                                    <td>{tranformPhone(doacao.doador.telefone)}</td>
                                    <td>{doacao.statusPedido.status}</td>
                                    <td>{tranformDate(doacao.dataPedido)}</td>
                                    <td>{doacao.valorTotal}</td>
                                    <td>{doacao.quantidadeCaixas}</td>
                                    <td onClick={() => getPDF(doacao.id)}><span class={`material-symbols-rounded ${styles["download"]}`}>
                                        download
                                    </span></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HistoricoDoacoes;