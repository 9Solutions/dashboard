import React, { useEffect, useRef, useState } from "react";
import QrFrame from "../../assets/qr-frame.svg";
import QrScanner from "qr-scanner";
import style from "./QrCode.module.css";
import { toast } from "react-toastify";
import {getStatusCaixas, patchCaixaStatus, getCaixaByQrCodeToken, postFoto} from "../../backend/methods";
import {base64ToBlob} from "../../globals";
import ConfirmPhotoModal from "../../components/modals/ConfirmPhotoModal";

const QrCode = () => {
    const scanner = useRef(null);
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);
    const canvasRef = useRef(null);
    const idPedido = useRef(null);
    const [qrOn, setQrOn] = useState(true);
    const [enableFoto, setEnableFoto] = useState(false);
    const [statusCaixas, setStatusCaixas] = useState();
    const [caixa, setCaixa] = useState(undefined);
    const [callBack, setCallBack] = useState(false);
    const [load, setLoad] = useState(false);
    const [image, setImage] = useState(undefined);
    const scannedResult = useRef("");

    const isSHA256 = (text) => {
        const sha256Regex = /^[a-f0-9]{64}$/i;
        return sha256Regex.test(text);
    }

    const onScanSuccess = (result) => {
        result = result.data

        if (result !== scannedResult.current) {
            if (isSHA256(result)) {
                scannedResult.current = result;
                setCallBack(prev => !prev);
                setEnableFoto(false);
            }else {
                toast.error("QR Code inválido");
            }
        }
    };

    const onScanFail = (err) => {
    };

    useEffect(() => {
        getStatusCaixas().then((response) => {
            setStatusCaixas(response.data);
        }).catch((error) => {
            console.error("Erro ao buscar os status das caixas: ", error);
        })
    }, []);

    useEffect(() => {
        const getCaixaByQrCode = (qrCode) => {
            getCaixaByQrCodeToken(qrCode).then((response) => {
                if (response.status === 200) {
                    setCaixa(response.data);
                    idPedido.current = response.data.idPedido
                } else {
                    toast.error("Caixa não encontrada");
                }
            }).catch((error) => {
                console.error("Erro ao buscar a caixa pelo QR Code: ", error);
            })
        }

        if (scannedResult.current !== ""){
            getCaixaByQrCode(scannedResult.current);
        }
    }, [callBack]);

    useEffect(() => {
        const updateCaixaStatus = (caixa) => {
            let statusAtual = caixa.etapas[caixa.etapas.length - 1].id;
            let proximoStatus = statusAtual + 1;

            if (proximoStatus > statusCaixas[statusCaixas.length - 1].id){
                toast.warn("Caixa já foi entregue");

            }else{
                if (proximoStatus === statusCaixas[statusCaixas.length - 1].id) {
                    toast.success("Caixa entregue com sucesso");
                    setEnableFoto(true);
                }
                let id = toast.loading("Atualizando Status da Caixa");
                patchCaixaStatus(caixa.id, proximoStatus).then(() => {
                    toast.update(id, {
                        render: "Status da Caixa Atualizado",
                        type: "success",
                        isLoading: false,
                        autoClose: 2000
                    });
                }).catch((error) => {
                    toast.update(id, {
                        render: "Erro ao atualizar o status da caixa",
                        type: "error",
                        isLoading: false,
                        autoClose: 2000
                    });
                    console.error("Erro ao atualizar o status da caixa: ", error);
                })
            }

        }

        if (caixa){
            updateCaixaStatus(caixa);
            setCaixa(undefined);
        }
    }, [caixa, statusCaixas]);

    useEffect(() => {
        const initializeScanner = async () => {
            if (videoEl?.current && !scanner.current) {
                // 👉 Instantiate the QR Scanner
                scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                    onDecodeError: onScanFail,
                    preferredCamera: "environment",
                    // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
                    highlightScanRegion: true,
                    // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
                    highlightCodeOutline: true,
                    // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
                    overlay: qrBoxEl?.current || undefined,
                });

                // 🚀 Start QR Scanner
                scanner?.current
                    ?.start()
                    .then(() => {
                        setQrOn(true)
                    })
                    .catch((err) => {
                        if (err) setQrOn(false);
                    });
            }
        };

        initializeScanner();

        // 🧹 Clean up on unmount.
        // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
        return () => {
            /* eslint-disable-next-line */
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
        /* eslint-disable-next-line */
    }, []);

    // ❌ If "camera" is not allowed in browser permissions, show an alert.
    useEffect(() => {
        if (!qrOn)
            alert(
                "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
            );
    }, [qrOn]);



    const capture = ()=> {
        const video = videoEl.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;


        context.drawImage(video, 0, 0, canvas.width, canvas.height);


        const imageSrc = canvas.toDataURL("image/jpeg");
        const parts = imageSrc.split(';base64,');

        setLoad(true);

        postFoto(base64ToBlob(parts[1], "image/jpeg")).then((response) => {
            let imageBase64 = "data:image/jpeg;base64,"+response.data;
            setImage(imageBase64);
        }).catch((error) => {
            console.error("Erro ao enviar a foto: ", error);
        });
    }

    return (

            <div className={style["qr-reader"]}>
                {/* QR */}
                <video ref={videoEl}></video>
                <div ref={qrBoxEl} className="qr-box">
                    {
                        !enableFoto &&
                        <img
                            src={QrFrame}
                            alt="Qr Frame"
                            width={"50%"}
                            height={"50%"}
                            className={style["qr-frame"]}
                        />
                    }
                </div>

                {
                    enableFoto &&
                    <div className={style["bt-foto-container"]}>
                        {!load && <button onClick={capture} className={style['bt-foto']}></button>}


                        {load && <div className={style["spinner"]}></div>}

                    </div>
                }

                {
                    (load && image) &&
                    <ConfirmPhotoModal setLoad={setLoad} setEnableFoto={setEnableFoto} image={image} setImage={setImage} idPedido={idPedido}></ConfirmPhotoModal>
                }


                <canvas ref={canvasRef} style={{display: "none"}}/>
            </div>

    );
};

export default QrCode;