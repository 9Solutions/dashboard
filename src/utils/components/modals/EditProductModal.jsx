import React, { useEffect, useState } from "react";
import style from "./EditProductModal.module.css";
import Button from "../button/Button";
import {
    getCategorias,
    getFaixasEtarias,
    putProduto,
    postProduto,
    delProduto,
    postImage
} from "../../backend/methods";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import {fileToBase64} from "../../globals";

const EditProductModal = ({ product, hiddenState, setReload }) => {
    const [categories, setCategories] = useState([]);
    const [ageLimits, setAgeLimits] = useState([]);
    const [open, setOpen] = useState(false);
    const [hidden, setHidden] = hiddenState;

    const [productName, setProductName] = useState(product.nome);
    const [productPrice, setProductPrice] = useState(product.valor);
    const [productCategory, setProductCategory] = useState(product.categoria.id);
    const [productAgeLimit, setProductAgeLimit] = useState(product.faixaEtaria.id);
    const [productGender, setProductGender] = useState(product.genero);
    const [productImage, setProductImage] = useState(null);

    const loadCategories = () => {
        getCategorias().then((response) => {
            setCategories(response.data);
        }).catch((error) => {
            console.error("Erro ao buscar as categorias: ", error);
        })
    }

    const loadAgeLimits = () => {
        getFaixasEtarias().then((response) => {
            setAgeLimits(response.data);
        }).catch((error) => {
            console.error("Erro ao buscar as faixas etárias: ", error);
        })
    }

    useEffect(() => {
        loadCategories();
        loadAgeLimits();
    }, []);

    useEffect(() => {
        setProductName(product.nome);
        setProductPrice(product.valor);
        setProductCategory(product.categoria.id);
        setProductAgeLimit(product.faixaEtaria.id);
        setProductGender(product.genero);
    }, [product]);

    const handleSave = () => {
        if (productName === '' || productPrice === '' || productCategory === '-1' || productAgeLimit === '-1' || productGender === '-1') {
            toast.error('Preencha todos os campos');
        } else if (productImage === null && product.id === -1) {
            toast.error('Selecione uma imagem');
        } else {
            const formData = {
                'nome': productName,
                'valor': productPrice,
                'idCategoriaProduto': productCategory,
                'idFaixaEtaria': productAgeLimit,
                'genero': productGender,
                'urlImagem': product['urlImagem'],
            }

            if (productImage !== null) {
                fileToBase64(productImage).then((base64) => {
                    console.log(base64);
                    postImage({
                        "content": base64
                    }).then((response) => {
                        if (response.status === 200) {
                            console.log(response)
                            formData['urlImagem'] = response.data.body.url;

                            if (product.id !== -1) {
                                putProduto(product.id, formData).then((response) => {
                                    if (response.status === 200) {
                                        toast.success('Produto salvo com sucesso');
                                        setHidden(true);
                                        setReload(prev => !prev);
                                    } else {
                                        toast.error('Erro ao salvar o produto, tente novamente');
                                    }
                                }).catch((error) => {
                                    console.error('Erro ao salvar o produto: ', error);
                                    toast.error('Erro ao salvar o produto, tente novamente');
                                })
                            } else {
                                postProduto(formData).then((response) => {
                                    if (response.status === 201) {
                                        toast.success('Produto salvo com sucesso');
                                        setHidden(true);
                                        setReload(prev => !prev);
                                    } else {
                                        toast.error('Erro ao salvar o produto, tente novamente');
                                    }
                                }).catch((error) => {
                                    console.error('Erro ao salvar o produto: ', error);
                                    toast.error('Erro ao salvar o produto, tente novamente');
                                })
                            }
                        }
                    });
                });


            }




        }
    }

    const handleDelete = () => {
        delProduto(product.id).then((response) => {
            if (response.status === 201) {
                toast.success('Produto deletado com sucesso');
                setOpen(false);
                setHidden(true);
                setReload(prev => !prev);
            } else {
                toast.error('Erro ao deletar o produto, tente novamente');
            }
        }).catch((error) => {
            console.error('Erro ao deletar o produto: ', error);
            toast.error('Erro ao deletar o produto, tente novamente');
        })
    }

    return (
        <div className={style['modal__main_container']} style={{ display: hidden ? 'none' : 'flex' }}>
            <ConfirmModal openState={[open, setOpen]} onConfirm={handleDelete} onCancel={() => setOpen(false)} message={'Deseja realmente deletar o produto?'} />
            <div className={style['modal__container']}>
                <div className={style['modal__header']}>
                    <h2>Editar Produto</h2>
                    <span className={`material-symbols-outlined close__button`} onClick={() => setHidden(true)}>close</span>
                </div>
                <div className={'separator'}></div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className={style['modal__form_container']}>
                        <label htmlFor="product_name">Nome do Produto</label>
                        <input type="text" id="product_name" name="product_name" value={productName} onChange={e => setProductName(e.target.value)} />
                    </div>
                    <div className={style['modal__form_container']}>
                        <label htmlFor="product_price">Preço do Produto</label>
                        <input type="number" id="product_price" name="product_price" value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder={'00,00'} />
                    </div>
                    <div className={style['modal__form_container']}>
                        <label htmlFor="product_category">Categoria do Produto</label>
                        <select id="product_category" name="product_category" value={productCategory} onChange={e => setProductCategory(e.target.value)}>
                            <option value={-1} disabled selected>Selecione uma categoria</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id} >{category.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className={style['modal__form_container']}>
                        <label htmlFor="product_gender">Gênero</label>
                        <select id="product_gender" name="product_gender" value={productGender} onChange={e => setProductGender(e.target.value)}>
                            <option value={-1} disabled selected>Selecione um gênero</option>
                            <option value={'M'}>Masculino</option>
                            <option value={'F'}>Feminino</option>
                            <option value={'U'}>Unissex</option>
                        </select>
                    </div>
                    <div className={style['modal__form_container']}>
                        <label htmlFor="product_age_limit">Faixa Etária do Produto</label>
                        <select id="product_ageLimit" name="product_ageLimit" value={productAgeLimit} onChange={e => setProductAgeLimit(e.target.value)}>
                            <option value={-1} disabled>Selecione uma faixa etária</option>
                            {ageLimits.map(ageLimit => (
                                <option key={ageLimit.id} value={ageLimit.id}>
                                    {ageLimit.limiteInferior} - {ageLimit.limiteSuperior}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={style['modal__form_container']}>
                        <label htmlFor="product_image">Imagem do Produto</label>
                        <input type="file" id="product_image" name="product_image" onChange={e => setProductImage(e.target.files[0])} />
                    </div>
                    <div className={style['modal__form_container_button']}>
                        {product.id !== -1 ? <Button title={'Deletar'} onClick={() => setOpen(true)} className={style['form__delete_button']} /> : null}
                        <Button title={'Salvar'} onClick={handleSave} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProductModal;