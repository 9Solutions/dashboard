import React from "react";
import styles from "./Navbar.module.css";
import "../../globals.js";

const Navbar = ({ page_title, isMinimal = false }) => {
    
    const fullNavbar = () => {
        const {nome} = JSON.parse(sessionStorage.getItem("auth"));
        return (
            <>
                <div className={styles["navbar__search__container"]}>
                    <input type="text" id="navbar__search__input" placeholder="Pesquisar Doação (Código, doador, telefone)" />
                    <span class="material-symbols-rounded">
                        search
                    </span>
                </div>
                <span className={styles["navbar__username"]}>{nome}</span>
            </>
        );
    }

    return (
        <div className={styles["navbar"]}>
            <span className={styles["navbar__title"]}>{page_title}</span>
            {isMinimal ? <></> : fullNavbar()}
        </div>
    );
}

export default Navbar;