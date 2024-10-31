import React, {useRef, useState} from "react";
import Button from "../button/Button";
import style from "./ConfirmPhotoModal.module.css";
import {postFotoEmail} from "../../backend/methods";
import {base64ToBlob} from "../../globals";


const ConfirmPhotoModal = ({setLoad, setEnableFoto, image, setImage, idPedido}) => {
    const [isSend, setIsSend] = useState(false);

    const sendPhotoToEmail = () => {
        const parts = image.split(';base64,');

        if (!isSend) {
            setIsSend(true);
            postFotoEmail(base64ToBlob(parts[1], "image/jpeg"), idPedido.current).then((response) => {
                setLoad(false);
                setEnableFoto(false); 
                setIsSend(false);
            }).catch((error) => {
                console.error("Erro ao enviar a foto: ", error);
            });
        }
    }

    const onCancel = () => {
        setImage(undefined);
        setLoad(false);
    }

    return (
        <div className={style["modal"]}>
            <div className={style["modal-content"]}>
                <div className={style['modal__infos']}>
                    <h2>Confirme a Foto!</h2>
                    <h4>Por favor, verifique se todos os rostos foram devidamente borrados.</h4>
                </div>
                <img src={image}/>
                <div className={style["modal-buttons__container"]}>
                    <Button onClick={onCancel}  title={'Tentar Novamente'}/>

                    <Button onClick={sendPhotoToEmail}
                            className={style['form__confirm_button']} title={isSend ? <div></div> : 'Confirmar'}/>
                </div>
            </div>
        </div>
    );
}

export default ConfirmPhotoModal;