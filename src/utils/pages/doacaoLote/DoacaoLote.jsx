import React, { useRef, useState } from "react";
import styles from "./DoacaoLote.module.css";
import caixaCarrinho from "../../assets/carrinho.png";
import Navbar from "../../components/navbar/Navbar";
import LeftBar from "../../components/leftBar/LeftBar";
import { NumericFormat } from "react-number-format";

const DoacaoLote = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [doacao, setDoacao] = useState(0);

    const calcularCaixas = (valor) => {
        const valorDoacao = parseFloat(valor);
        if (!isNaN(valorDoacao) && valorDoacao > 0) {
            return Math.floor(valorDoacao / 75);
        }
        return 0;
    };

    const handleDoacaoChange = (values) => {
        setDoacao(values.floatValue);
    };


    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click(); 
    };

    return (
        <>
            <Navbar />
            <LeftBar />
            <h2 className={styles["titulo-lote"]}>Doações em Lote</h2>
            <div className={styles["div-lote"]}>
                <div className={styles["container-esq-dir"]}>
                    <div className={styles["lado-esquerdo"]}>
                        <label className={styles["label-lote"]} htmlFor="identificador">
                            Insira o valor que será doado:
                        </label><br/>
                        <NumericFormat
                            thousandSeparator={false}
                            decimalSeparator=","
                            decimalScale={2} // Limit to 2 decimal places
                            allowNegative={false} // Optionally allow negatives
                            placeholder="1000"
                            onValueChange={handleDoacaoChange}
                            className={styles["input-doacao-lote"]}
                        /><br></br>
                        <label className={styles["label-lote"]}>
                            Quantidade de Caixas <br></br>
                        </label>
                        <input
                            className={styles["input-doacao-lote"]}
                            type="number"
                            value={calcularCaixas(doacao)}
                            min={1}
                            /><br></br>

                        <label className={styles["label-lote"]}>
                            Escreva uma cartinha para as crianças: <br></br>
                        </label>

                        <input className={styles['input-doacao-lote']} type="text"/><br></br>

                        <div className={styles["caixa-carrinho"]}>
                            <img src={caixaCarrinho} alt=""/>
                            <p>
                                Parabéns Doador! Você fará muitas crianças felizes com {calcularCaixas(doacao)}{" "}
                                caixas de sapato possíveis.
                            </p>

                        </div>
                    </div>

                    <div className={styles["lado-direito"]}>
                        <p>Insira sua foto aqui</p>
                        <button
                            type="button"
                            onClick={triggerFileInput}
                            className={styles["file-button"]}
                        >
                            Selecionar Imagem
                        </button>
                        <input
                            type="file"
                            className={styles['input-doacao-lote']}
                            ref={fileInputRef} 
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }} 
                        />
                        <br></br>
                        {imagePreview && (
                            <img
                                id="preview"
                                src={imagePreview}
                                alt="Pré-visualização da imagem"
                                className={styles["image-preview"]}
                            />
                        )}
                        <p> <b>Resultado</b><br></br>
                            Preço: R$ {doacao}</p> 
                    </div>

                </div>
                <button className={styles["login-button"]}>
                    Avançar
                </button>
            </div>
        </>
    );
};

export default DoacaoLote;
