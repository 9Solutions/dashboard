import React, {useRef, useState } from "react";
import styles from "./DoacaoLote.module.css";
import caixaCarrinho from "../../assets/carrinho.png";
import Navbar from "../../components/navbar/Navbar";
import LeftBar from "../../components/leftBar/LeftBar";

const DoacaoLote = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

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
        fileInputRef.current.click(); // Aciona o clique no input de arquivos
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
                        </label><br></br>
                        <input className={styles['input-doacao-lote']} type="text" placeholder="R$1000" /><br></br>
                        <label className={styles["label-lote"]}>
                            Escreva uma cartinha para as crianças: <br></br>
                        </label>

                        <input className={styles['input-doacao-lote']} type="text" className={styles["cartinha"]} /><br></br>

                        <div className={styles["caixa-carrinho"]}>
                            <img src={caixaCarrinho} alt="" />
                            <p>Parabéns! Você fará muitas crianças felizes com  X <br></br> quantidade de caixas de sapato possíveis.</p>
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
                            ref={fileInputRef} // Referência ao input de arquivos
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            style={{ display: 'none' }} // Oculta o input de arquivos
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

                        <h2>Resultado: </h2>
                        <p>Preço Total: R$</p>
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
