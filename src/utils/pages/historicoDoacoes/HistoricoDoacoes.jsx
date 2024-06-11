import React from "react";
import styles from "./HistoricoDoacoes.module.css";
import LeftBar from "../../components/leftBar/LeftBar";
import Navbar from "../../components/navbar/Navbar";
import KPI from "../../components/kpi/KPI";
import { useState, useEffect } from "react";
import { getAllDoacoes, getDoacaoFiltro, getAllDoacoesDetalhadas, getCaixasEntregar, getCaixasAtrasadas, getCaixasMontar } from "../../backend/methods";
import { tranformDate, tranformPhone } from "../../globals";
import { useSearchParams } from "react-router-dom";
import GenerateMatriz from "../../generateMatriz";

const getMatriz = async () => {
    getAllDoacoesDetalhadas().then((response) => {
        var matriz = GenerateMatriz(response.data);

        localStorage.setItem("grafico_para_monitoramento_de_atrasos", JSON.stringify(matriz));
    })
}
    

const HistoricoDoacoes = () => {
    const [searchParams] = useSearchParams();

    const [doacoes, setDoacoes] = useState([]);
    const [qtdEntrega, setQtdEntrega] = useState([]);
    const [qtdAtrasadas, setQtdAtrasadas] = useState([]);
    const [qtdMontar, setQtdMontar] = useState([]);

    const data = searchParams.get('data');
    const status = searchParams.get('status');
    const idDoacao = searchParams.get('idDoacao');

    const isSelected = (value) => status === value;


    const loadDoacoes = () => {
        if (searchParams.size === 3) {
            getDoacaoFiltro(status, data, idDoacao).then((response) => {
                setDoacoes(response.data);
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

    const loadQtdAtrasadas = () => {
        getCaixasAtrasadas().then((response) => {
            setQtdAtrasadas(response.data[0].qtdCaixasAtrasadas);
        }
        ).catch((error) => {
            console.error("Erro ao buscar as caixas atrasadas: ", error);
        })
    }


    useEffect(() => {
        getMatriz();

        loadDoacoes();

        loadQtdEntrega();

        loadQtdMontar();

        loadQtdAtrasadas();

    }, [data, status, idDoacao, searchParams.size]);

    return (
        <div style={{ display: "flex", alignItems: 'center', flexDirection: "column" }}>
            <LeftBar />
            <Navbar page_title="Histórico de Doações" />
            <div className={styles["kpi__container"]}>
                <KPI title="Caixas que precisam ser feitas" count={qtdMontar} comparison="10" isIncrease={true} />
                <KPI title="Caixas prontas para entrega" count={qtdEntrega} comparison="10" isIncrease={false} />
                <KPI title="Caixas atrasadas" count={qtdAtrasadas} comparison="10" isIncrease={false} />
            </div>

            <div className={styles["relatorio__container"]}>
                <h1>Lista de Doações</h1>
                <div className={styles["filtro__container"]}>
                    <form className={styles["form__filtros"]} method="GET">
                        <div><label>Nº do Pedido</label>
                            <input type="text" placeholder="000000" name="idDoacao" defaultValue={idDoacao} /></div>
                        <div><label>Data Doação</label>
                            <input type="date" name="data" defaultValue={data} /></div>
                        <div><label>Status</label>
                            <select name="status">
                                <option value="" selected={isSelected("")}>Todos</option>
                                <option value="novo" selected={isSelected("novo")}>Novo</option>
                                <option value="montagem" selected={isSelected("montagem")}>Em Montagem</option>
                                <option value="entregue" selected={isSelected("entregue")}>Em Entrega</option>
                                <option value="finalizado" selected={isSelected("finalizado")}>Finalizado</option>
                            </select>
                        </div>

                        <button type="submit">Filtrar</button>
                    </form>

                    <span className={styles["legenda"]}>Legenda <span class="material-symbols-outlined">
                        info
                    </span>
                        <div className={styles["legenda-field"]}>
                            <div><div className={`${styles["circle"]} ${styles["red"]}`}></div><span>+2 Semanas</span></div>
                            <div><div className={`${styles["circle"]} ${styles["yellow"]}`}></div><span>+5 Dias</span></div>
                            <div><div className={`${styles["circle"]} ${styles["green"]}`}></div><span>Até 5 Dias</span></div>
                        </div>
                    </span>
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
                            <th>Status de Espera</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(doacoes.length === 0) ? <tr><td colSpan="8">Nenhuma doação encontrada</td></tr> :
                            doacoes.map((doacao, index) => (
                                <tr key={index}>
                                    <td>{doacao.id}</td>
                                    <td>{doacao.doador.nome}</td>
                                    <td>{tranformPhone(doacao.doador.telefone)}</td>
                                    <td>{doacao.statusPedido.status}</td>
                                    <td>{tranformDate(doacao.dataPedido)}</td>
                                    <td>{doacao.valorTotal}</td>
                                    <td><div className={`${styles["circle"]} ${styles["red"]}`}></div></td>
                                    <td><span class={`material-symbols-rounded ${styles["download"]}`}>
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