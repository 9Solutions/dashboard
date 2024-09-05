import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Login.module.css";
import logo_img from '../../assets/logo.png';
import Navbar from "../../components/navbar/Navbar";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { login } from "../../backend/methods";
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();
    const emailRef = useRef(null);
    const senhaRef = useRef(null);

    useEffect(() => {
        if (sessionStorage.getItem("auth") !== null) {
            navigate("/historico-doacoes");
        }
    }
    , [navigate]);


    const handleLogin = async () => {
        const email = emailRef.current.value;
        const senha = senhaRef.current.value;

        login(email, senha)
            .then((response) => {
                if (response.status !== 200) {
                    toast.error("Email ou Senha Inválidos!");
                    return;
                }
        
                const data = response.data;

                if (data.permissao !== "admin") {
                    toast.error("Usuário sem permissão!");
                    return;
                }
        
                sessionStorage.setItem("auth", JSON.stringify(data));


                //Verificar se é smartphone
                if( navigator.userAgent.match(/Android/i)
                    || navigator.userAgent.match(/webOS/i)
                    || navigator.userAgent.match(/iPhone/i)
                    || navigator.userAgent.match(/iPad/i)
                    || navigator.userAgent.match(/iPod/i)
                    || navigator.userAgent.match(/BlackBerry/i)
                    || navigator.userAgent.match(/Windows Phone/i)
                ){
                    window.location.href = "/qr-code";
                }
                else {
                    window.location.href = "/historico-doacoes";
                }






            })
            .catch((error) => {
                console.log(error);
                toast.error("Email ou Senha Inválidos!");
            });
    }

    return (
        <>
            <div className={styles["page__container"]}>
                <div className={styles["left__panel"]}><img src={logo_img} alt="Logo do Projeto Caixa de Sapato"></img></div>
                <div className={styles["login__container"]}>
                    <Navbar page_title="Acesso a Dashboard" isMinimal={true}/>

                    <div>
                        <h1 className={styles["login__title"]}>Login</h1>

                        <form className={styles["login__form"]} onSubmit={(e) => e.preventDefault()}>
                            <Input title="E-mail" type="email" placeholder="Digite seu e-mail" inputRef={emailRef} required={true}/>
                            <Input title="Senha" type="password" placeholder="Digite sua senha" inputRef={senhaRef} required={true}/>
                            <Button title="Entrar" onClick={handleLogin}/>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;