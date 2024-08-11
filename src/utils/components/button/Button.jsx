import React from "react";
import styles from "./Button.module.css";

const Button = ({ title, onClick, className, style = {} }) => {
    return (
        <button className={`${styles['button']} ${className}`} onClick={onClick} style={style}>{title}</button>
    );
}

export default Button;