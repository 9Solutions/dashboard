import React, {useEffect, useState} from "react";
import style from "./EditProductContainer.module.css";
import Button from "../button/Button";
import EditProductModal from "../modals/EditProductModal";
import {getCategoriasFiltradas} from "../../backend/methods";

const EditProductContainer = ({data, containerHiddenState, setReload, estagio}) => {
    const [editContainerisHidden, setEditContainerisHidden] = containerHiddenState
    const [editProductModalisHidden, setEditProductModalisHidden] = useState(true);
    const defaultProduct = {
        id: -1,
            nome: '',
            genero: '-1',
            valor: '',
            urlImagem: '',
            categoria: {
            id: -1,
        },
        faixaEtaria: {
            id: -1,
        }
    }
    const [productToEdit, setProductToEdit] = useState(defaultProduct);
    const [categories, setCategories] = useState([]);

    const loadCategories = () => {
        getCategoriasFiltradas(estagio).then((response) => {
            setCategories(response.data);
        }).catch((error) => {
            console.error("Erro ao buscar as categorias: ", error);
        })
    }

    useEffect(() => {
        loadCategories();
    }, [estagio]);

    const openEditProductModal = (product) => {
        setEditProductModalisHidden(false);
        setProductToEdit(product);
    }

    return (
        <div className={style['edit_product__container']} style={{display: editContainerisHidden ? 'none' : 'block'}}>
            <div className={style['right_buttons__container']}>
                <Button title={'Adicionar Categoria'} style={{width: '100px'}} onClick={() => console.log('Adicionar Categoria')}/>
                <span className={`material-symbols-outlined close__button`}
                      onClick={() => setEditContainerisHidden(true)}>close</span>
            </div>
            {categories.map((category, index) => {
                return (
                    <div key={index}>
                    <h2 className={style['category__span']}>{category.nome}</h2>
                        <div className={'separator'}></div>
                        <div className={style['items__container']}>
                            {data.filter(product => product.categoria.id === category.id).map((product, index) => {
                                return (
                                    <div key={index} className={style['product_item__container']}>
                                            <span
                                                className={`material-symbols-outlined ${style['product_item__edit_button']}`}
                                                onClick={() => {
                                                    openEditProductModal(product);
                                                }}>
                                                edit
                                            </span>
                                        <div className={style['edit-product-item-image']}>
                                            <img src={product['imagem']} alt={product['nome']}/>
                                        </div>
                                        <div className={style['product_item__info']}>
                                            <h3>{product['nome']}</h3>
                                            <p>{product['faixaEtaria']['limiteInferior']} - {product['faixaEtaria']['limiteSuperior']} Anos</p>
                                            <p>R$ {parseFloat(product['valor']).toFixed(2)}</p>
                                        </div>
                                    </div>
                                )
                            })}

                            <div className={style['product_item__container']}>
                                <div className={style['edit-product-item-image']}>
                                    <span className={`material-symbols-rounded ${style['product_add__button']}`} onClick={() => {
                                        defaultProduct["categoria"] = category;
                                        openEditProductModal(defaultProduct);
                                    }}>
                                        add
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}

            <EditProductModal product={productToEdit}
                              hiddenState={[editProductModalisHidden, setEditProductModalisHidden]} setReload={setReload}/>
        </div>
    )


}

export default EditProductContainer;