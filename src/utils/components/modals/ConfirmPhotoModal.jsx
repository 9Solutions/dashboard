import React from "react";
import Button from "../button/Button";
import style from "./ConfirmPhotoModal.module.css";
import {postFotoEmail} from "../../backend/methods";
import {base64ToBlob} from "../../globals";


const ConfirmPhotoModal = ({setLoad, setEnableFoto, image}) => {
    const sendPhotoToEmail = () => {
        const parts = image.split(';base64,');
        postFotoEmail(base64ToBlob(parts[1], "image/jpeg"), 6).then((response) => {
            setLoad(false);
            setEnableFoto(false);
        }).catch((error) => {
            console.error("Erro ao enviar a foto: ", error);
        });
    }

    const onCancel = () => {
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
                    <Button onClick={sendPhotoToEmail} className={style['form__confirm_button']} title={'Confirmar'}/>
                </div>
            </div>
        </div>
    );
}

export default ConfirmPhotoModal;