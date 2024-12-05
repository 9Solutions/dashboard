import React, { useRef, useState } from "react";
import styles from "./DoacaoLote.module.css";
import caixaCarrinho from "../../assets/carrinho.png";
import Navbar from "../../components/navbar/Navbar";
import LeftBar from "../../components/leftBar/LeftBar";
import { NumericFormat } from "react-number-format";
import { postPedido, postCaixa, postImage, postDoadorLote} from "../../backend/methods";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const DoacaoLote = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [doacao, setDoacao] = useState(0);
    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [emailEmpresa, setEmailEmpresa] = useState('');
    const [telefoneEmpresa, setTelefoneEmpresa] = useState('');
    const [valorDoado, setValorDoado] = useState(0);
    const [mensagem, setMensagem] = useState('');
    const permissaoAdmin = "user_by_import";
    const senha = "senha123";


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

    const cadastrarPedidoLote = async () => {
        // let auth = JSON.parse(sessionStorage.getItem('auth'))

        const quantidadeCaixas = calcularCaixas(doacao);
        const valorTotal = Number.parseFloat((75 * quantidadeCaixas).toFixed(2));

        try {

            const doadorResponse = await postDoadorLote(
                nomeEmpresa, 
                emailEmpresa,
                telefoneEmpresa, 
                senha, 
                permissaoAdmin
            )

            if (doadorResponse.status === 201) {

            const response = await postPedido({
                valorTotal,
                statusPedido: 1,
                idDoador: doadorResponse.data.id
            });

            if (response.status === 200) {
                const image = await sendImage()

                for(let i = quantidadeCaixas; i > 0; i--) {
                    await cadastrarCaixaLote(response.data.id, image)
                }
                toast.success("Pedido cadastrado com sucesso!")
            }
        } else {
            throw new Error("Erro ao criar doador.");
        }
        } catch (error) {
            console.error(`Erro ao enviar pedido: ${error}`);
            toast.error(`${error}`)
        }
    };


    const cadastrarCaixaLote = async (idPedido, urlImage) => {
        const quantidadeCaixas = calcularCaixas(doacao);
        try {
            const response = await postCaixa({
                "genero": "F",
                "carta": mensagem,
                "url": urlImage,
                "quantidade": quantidadeCaixas,
                "dataCriacao": dayjs().format('YYYY-MM-DD'),
                "idFaixaEtaria": 1,
                "itensCaixa": [
                    1, 2, 3
                ],
                "idPedido": idPedido,
            });

            if(response.status === 200) {
                return;
            }
        } catch (error) {
            throw new Error("Erro durante o cadastro da caixa");
        }
    };

    const sendImage = async () => {
        const fotoSession = sessionStorage.getItem('foto')
        if (fotoSession) {
            const response = await postImage({
                "content": fotoSession
            })

            if (response.status === 200) {
                return response.data.body.url
            }
        } else {
            return 'https://caixadesapato-public.s3.us-east-1.amazonaws.com/foto-padrao.png'
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await cadastrarPedidoLote();
    };




    return (
        <>
            <Navbar />
            <LeftBar />
            <h2 className={styles["titulo-lote"]}>Doações em Lote</h2>
            <form className={styles["div-lote"]} onSubmit={handleSubmit}>
                <div className={styles["container-esq-dir"]}>
                    <div className={styles["lado-esquerdo"]}>
                        <label className={styles["label-lote"]}>
                            Nome da empresa: <br />
                        </label>
                        <input
                            type="text"
                            placeholder="Nome"
                            className={styles["input-doacao-lote"]}
                            value={nomeEmpresa}
                            onChange={(e) => setNomeEmpresa(e.target.value)}
                        />

                        <br />

                        <label className={styles["label-lote"]}>
                            Email da empresa: <br />
                        </label>
                        <input
                            type="email"
                            placeholder="Email"
                            className={styles["input-doacao-lote"]}
                            value={emailEmpresa}
                            onChange={(e) => setEmailEmpresa(e.target.value)}
                        />
                        <br />

                        <label className={styles["label-lote"]}>
                            Telefone da empresa: <br />
                        </label>
                        <input
                            type="tel"
                            placeholder="Telefone"
                            className={styles["input-doacao-lote"]}
                            value={telefoneEmpresa}
                            onChange={(e) => setTelefoneEmpresa(e.target.value)}
                        />
                        <br />


                        <label className={styles["label-lote"]} htmlFor="identificador">
                            Insira o valor que será doado:
                        </label>
                        <br />
                        <NumericFormat
                            thousandSeparator={false}
                            decimalSeparator=","
                            decimalScale={2}
                            allowNegative={false}
                            placeholder="1000"
                            value={valorDoado}
                            onChange={(e) => setValorDoado(e.target.value)}
                            onValueChange={handleDoacaoChange}
                            className={styles["input-doacao-lote"]}
                        />
                        <br />
                        <label className={styles["label-lote"]}>
                            Quantidade de Caixas <br />
                        </label>
                        <input
                            className={styles["input-doacao-lote"]}
                            type="number"
                            value={calcularCaixas(doacao)}
                            min={1}
                            readOnly
                        />
                        <br />

                        <label className={styles["label-lote"]}>
                            Escreva uma cartinha para as crianças: <br />
                        </label>
                        <textarea
                            className={styles["input-doacao-lote"]}
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                        />
                        <br />

                        <div className={styles["caixa-carrinho"]}>
                            <img src={caixaCarrinho} alt="" />
                            <p>
                                Parabéns Doador! Você fará muitas crianças felizes com {calcularCaixas(doacao)} caixas de
                                sapato possíveis.
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
                            className={styles["input-doacao-lote"]}
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                        />
                        <br />
                        {imagePreview && (
                            <img
                                id="preview"
                                src={imagePreview}
                                alt="Pré-visualização da imagem"
                                className={styles["image-preview"]}
                            />
                        )}
                        <p>
                            <b>Resultado</b>
                            <br />
                            Preço: R$ {doacao}
                        </p>
                    </div>
                </div>
                <button type="submit" className={styles["login-button"]}>
                    Avançar
                </button>
            </form>
        </>
    );
};

export default DoacaoLote;
