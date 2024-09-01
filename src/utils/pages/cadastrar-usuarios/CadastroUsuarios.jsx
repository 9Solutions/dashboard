import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CadastroUsuarios.module.css";
import logo_img from "../../assets/logo.png";
import Navbar from "../../components/navbar/Navbar";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { toast } from "react-toastify";
import api from "../../../api"

const CadastroUsuarios = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
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
      <div className={styles["page__container"]}>
        <div className={styles["left__panel"]}>
          <img src={logo_img} alt="Logo do Projeto Caixa de Sapato"></img>
        </div>
        <div className={styles["login__container"]}>
          <Navbar page_title="Usuários" isMinimal={true} />

          <div>
            <h1 className={styles["login__title"]}>Login</h1>

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
                onChange={(e) => handleInputChange(e, setEmail)}
              />
              <Input
                title="Senha"
                type="password"
                placeholder="Digite sua senha"
                inputRef={senha}
                required={true}
                onChange={(e) => handleInputChange(e, setSenha)}
              />
              <Input
                title="ConfirmarSenha"
                type="password"
                placeholder="Confirme sua senha"
                inputRef={confirmarSenha}
                required={true}
                onChange={(e) => handleInputChange(e, setConfirmarSenha)}
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
