import React from "react";
import Button from "../button/Button";
import style from "./ConfirmModal.module.css";

const ConfirmModal = ({openState, onConfirm, onCancel, message}) => {
    const [open, isOpened] = openState;

    return (
        <div className={style["modal"]} style={{display: open ? 'flex' : 'none'}}>
            <div className={style["modal-content"]}>
                <div className={style['modal__infos']}>
                    <h2>{message}</h2>
                    <span className="material-symbols-outlined close__button"
                          onClick={() => isOpened(false)}>close</span>
                </div>
                <div className={style["modal-buttons__container"]}>
                    <Button onClick={onConfirm} className={style['form__delete_button']} title={'Confirmar'}/>
                    <Button onClick={onCancel}  title={'Cancelar'}/>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;