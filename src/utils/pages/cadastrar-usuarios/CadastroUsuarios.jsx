import React, {useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CadastroUsuarios.module.css";
import logo_img from "../../assets/logo.png";
import Navbar from "../../components/navbar/Navbar";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { toast } from "react-toastify";
import api from "../../../api"
import LeftBar from "../../components/leftBar/LeftBar";

const CadastroUsuarios = () => {
  const email = useRef("");
  const senha = useRef("");
  const confirmarSenha = useRef("");
  const permissao = 'admin'
  const handleSave = () => {
    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
    } else {

      api
        .post(`/doadores`, {
          email,
          senha,
          permissao,
        })
        .then(() => {
          toast.success("Cadastro realizado  com sucesso!");
        })
        .catch(() => {
          toast.error(
            "Ocorreu um erro ao salvar os dados, por favor, tente novamente."
          );
        });
    }
};

  const handleInputChange = (event, setStateFunction) => {
    setStateFunction(event.target.value);
  };

  return (
    <>
      <Navbar page_title="Usuários"/>
      <LeftBar/>

      <div className={styles["page__container"]}>
        <div className={styles["login__container"]}>

          <div>
            <h1 className={styles["login__title"]}>Novo Usuário</h1>

            <form
              className={styles["login__form"]}
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                title="E-mail"
                type="email"
                placeholder="Digite seu e-mail"
                inputRef={email}
                required={true}
              />
              <Input
                title="Senha"
                type="password"
                placeholder="Digite sua senha"
                inputRef={senha}
                required={true}
              />
              <Input
                title="Confirmar Senha"
                type="password"
                placeholder="Confirme sua senha"
                inputRef={confirmarSenha}
                required={true}
              />
              <Button title="Cadastrar" onClick={handleSave} />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CadastroUsuarios;
