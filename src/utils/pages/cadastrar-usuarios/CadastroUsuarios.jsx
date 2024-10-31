import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CadastroUsuarios.module.css";
import logo_img from "../../assets/logo.png";
import Navbar from "../../components/navbar/Navbar";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { toast } from "react-toastify";
import api from "../../../api";
import LeftBar from "../../components/leftBar/LeftBar";

const CadastroUsuarios = () => {
  const nomeRef = useRef("");
  const emailRef = useRef("");
  const senhaRef = useRef("");
  const confirmarSenhaRef = useRef("");
  const permissaoRef = useRef("");
  const handleSave = () => {
    const nome = nomeRef.current.value;
    const email = emailRef.current.value;
    const senha = senhaRef.current.value;
    const confirmarSenha = confirmarSenhaRef.current.value;
    const permissao = permissaoRef.current.value

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
    } else {
      api
        .post(`/doadores`, {
          nome,
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

  return (
    <>
      <Navbar page_title="Usuários" />
      <LeftBar />

      <div className={styles["page__container"]}>
        <div className={styles["login__container"]}>
          <div>
            <h1 className={styles["login__title"]}>Novo Usuário</h1>

            <form
              className={styles["login__form"]}
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                title="Nome"
                type="text"
                placeholder="Digite seu nome"
                inputRef={nomeRef}
                required={true}
              />
              <Input
                title="E-mail"
                type="email"
                placeholder="Digite seu e-mail"
                inputRef={emailRef}
                required={true}
              />
              <Input
                title="Senha"
                type="password"
                placeholder="Digite sua senha"
                inputRef={senhaRef}
                required={true}
              />
              <Input
                title="Confirmar Senha"
                type="password"
                placeholder="Confirme sua senha"
                inputRef={confirmarSenhaRef}
                required={true}
              />
              <Input
                title="Permissão"
                type="text"
                placeholder="Digite o nivel de permissão"
                inputRef={permissaoRef}
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
