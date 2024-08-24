import React from "react";
import style from "./LoadModal.module.css"

const LoadModal = ()=> {
    return (
        <div className={style["modal-container"]}>
            <div className={style["modal"]}>
                <div className={style["spinner"]}>

                </div>
            </div>
        </div>
    )
}

export default LoadModal;