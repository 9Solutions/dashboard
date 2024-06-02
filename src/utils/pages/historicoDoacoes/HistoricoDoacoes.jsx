import React from "react";
import styles from "./HistoricoDoacoes.module.css";
import LeftBar from "../../components/leftBar/LeftBar";
import Navbar from "../../components/navbar/Navbar";
import KPI from "../../components/kpi/KPI";
import { useState, useEffect } from "react";
import { getAllDoacoes } from "../../services/doacoesService";

const HistoricoDoacoes = () => {
    const [ doacoes, setDoacoes ] = useState([]);

    useEffect(() => {
        getAllDoacoes().then((response) => {
            setDoacoes(response.data);
        }).catch((error) => {
            console.error("Erro ao buscar as doações: ", error);
        })
    }, []);

    return (
        <div style={{ display: "flex", alignItems: 'center', flexDirection: "column" }}>
            <LeftBar />
            <Navbar page_title="Histórico de Doações" />
            <div className={styles["kpi__container"]}>
                <KPI title="Caixas que precisam ser feitas" count="100" comparison="10" isIncrease={true} />
                <KPI title="Caixas prontas para entrega" count="10" comparison="10" isIncrease={false} />
                <KPI title="Caixas atrasadas" count="10" comparison="10" isIncrease={false} />
            </div>

            <div className={styles["relatorio__container"]}>
                <h1>Lista de Doações</h1>
                <div className={styles["filtro__container"]}>
                    <form className={styles["form__filtros"]}>
                        <div><label>Nº do Pedido</label>
                            <input type="text" placeholder="000000" /></div>
                        <div><label>Data Doação</label>
                            <input type="date" /></div>
                        <div><label>Status</label>
                            <select>
                                <option value="todos" disabled>Todos</option>
                                <option value="novo">Novo</option>
                                <option value="montagem">Em Montagem</option>
                                <option value="entregue">Em Entrega</option>
                                <option value="finalizado">Finalizado</option>
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
                        {
                            doacoes.map((doacao, index) => (
                                <tr key={index}>
                                    <td>{doacao.id}</td>
                                    <td>{doacao.doador.nome}</td>
                                    <td>{doacao.doador.telefone}</td>
                                    <td>{doacao.status}</td>
                                    <td>{doacao.dataDoacao}</td>
                                    <td>{doacao.valor}</td>
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