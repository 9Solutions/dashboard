import React from "react";
import styles from "./Button.module.css";

const Button = ({ title, onClick }) => {
    return (
        <button className={styles['button']} onClick={onClick}>{title}</button>
    );
}

export default Button;