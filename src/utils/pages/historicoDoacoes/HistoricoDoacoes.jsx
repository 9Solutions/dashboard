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
    postPDF
} from "../../backend/methods";
import {base64ToBlob, tranformDate, tranformPhone} from "../../globals";
import { useSearchParams } from "react-router-dom";


const HistoricoDoacoes = () => {
    const [searchParams] = useSearchParams();

    const [doacoes, setDoacoes] = useState([]);
    const [qtdEntrega, setQtdEntrega] = useState([]);
    const [qtdMontar, setQtdMontar] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const data = searchParams.get('data');
    const status = searchParams.get('status');
    const idDoacao = searchParams.get('idDoacao');

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

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
      };

      const importCSV = () => {
        if (!selectedFile) {
            alert("Por favor, selecione um arquivo CSV");
            return;
        }
    
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'csv') {
            alert("Por favor, selecione um arquivo no formato CSV.");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', selectedFile);
    
        fetch('http://localhost:8080/api/import-csv', {
            method: 'POST',
            body: formData,
            headers: {
            },
        })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Falha ao importar o arquivo.');
            }
        })
        .then((data) => {
            alert('Arquivo CSV importado com sucesso!');
            console.log('Resposta do servidor:', data);
        })
        .catch((error) => {
            console.error("Erro ao importar o arquivo:", error);
            alert('Erro ao importar o arquivo.');
        });
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

    const exportCSV = () => {
        if (doacoes.length === 0) {
            alert('Nenhuma doação para exportar.');
            return;
        }
    
        let csvContent = 'Nº Doação,Doador,Telefone,Status,Data Doação,Valor,Quantidade de Caixas\n';
    
        doacoes.forEach((doacao) => {
            csvContent += `${doacao.id},${doacao.doador.nome || doacao.doador.nomeCompleto},${tranformPhone(doacao.doador.telefone)},${doacao.statusPedido.status},${tranformDate(doacao.dataPedido)},${doacao.valorTotal},${doacao.quantidadeCaixas}\n`;
        });
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'historico_doacoes.csv');
    
        document.body.appendChild(link);
        link.click();
    
        document.body.removeChild(link);
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
                      accept=".csv" 
                      onChange={handleFileChange} 
                      style={{ display: 'none' }} 
                      id="upload-csv"
                    />
                    <label htmlFor="upload-csv" className={styles["botao-import"]}>
                        <img src={importPic} alt="" />
                        Importar CSV
                    </label>
            

                    <button className={styles["botao-export"]} onClick={exportCSV}>
                        <img src={exportPic} alt="" />Exportar CSV</button>

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