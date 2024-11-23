import React from 'react';
import Navbar from "../../components/navbar/Navbar";
import LeftBar from "../../components/leftBar/LeftBar";
import styles from "./Produtos.module.css";
import {getProdutos} from "../../backend/methods"
import { useEffect, useState } from "react";
import EditProductContainer from "../../components/editProductContainer/EditProductContainer";

const Produtos = () => {
    const [produtos, setProdutos] = useState([]);
    const [editContainerisHidden, setEditContainerisHidden] = useState(true);
    const [estagio, setEstagio] = useState(1);
    const [reload, setReload] = useState(false);


    const loadProdutos = () => {
        getProdutos().then((response) => {
            setProdutos(response.data);
        }).catch((error) => {
            console.error("Erro ao buscar os produtos: ", error);
        })
    }

    const handleEditContainer = (estagio) => {
        setEditContainerisHidden(true);
        setEstagio(estagio);
        setTimeout(() => {
            setEditContainerisHidden(false);
        }, 700);
    }

    useEffect(() => {
        loadProdutos();
    }, [reload]);

    return (
        <>
            <Navbar page_title="Itens de Doação"/>
            <LeftBar/>

            <div className={styles['mount_box__container']} style={{height: editContainerisHidden ? '100vh' : '30vh'}}>
                <span className="material-symbols-outlined" onClick={() => {handleEditContainer(1)}}>
                apparel
                </span>
                <div></div>
                <span className="material-symbols-outlined" onClick={() => {handleEditContainer(2)}}>
                local_library
                </span>
                <div></div>
                <span className="material-symbols-outlined" onClick={() => {handleEditContainer(3)}}>
                toys
                </span>
            </div>

            <EditProductContainer data={produtos} estagio={estagio} containerHiddenState={[editContainerisHidden, setEditContainerisHidden]} setReload={setReload}/>

        </>
    );
}

export default Produtos;