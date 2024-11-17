import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CadastroUsuarios.module.css";
import logo_img from "../../assets/logo.png";
import Navbar from "../../components/navbar/Navbar";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { toast } from "react-toastify";
import LeftBar from "../../components/leftBar/LeftBar";
import {getDoadores, postDoador} from "../../backend/methods";

const CadastroUsuarios = () => {
  const [donors, setDonors] = useState([]);
  const permissaoAdmin = "admin";

  useEffect(() => {
    getDoadores(permissaoAdmin).then((response) => {
      setDonors(response.data);
    }).catch(() => {
      toast.error("Erro ao carregar os doadores");
    });
  }, []);

  const emailRef = useRef("");
  const senhaRef = useRef("");
  const confirmarSenhaRef = useRef("");
  const handleSave = () => {
    const email = emailRef.current.value;
    const senha = senhaRef.current.value;
    const confirmarSenha = confirmarSenhaRef.current.value;

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
    } else {
      postDoador(email, senha, permissaoAdmin).then(() => {
        toast.success("Cadastro realizado com sucesso!");
      }).catch(() => {
        toast.error("Erro ao salvar os dados, por favor, tente novamente.");
      })

    }
  };

  const handleInputChange = (event, setStateFunction) => {
    setStateFunction(event.target.value);
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
              <Button title="Cadastrar" onClick={handleSave} />
            </form>
          </div>
        </div>
      </div>
      <div className={styles["page__container"]}>
        <div className={styles["table__container"]}>
          <h1 className={styles["table__title"]}>Doadores</h1>

          <table className={styles["responsive__table"]}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Permissão</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor) => (
                <tr key={donor.id}>
                  <td>{donor.id}</td>
                  <td>{donor.email}</td>
                  <td>{donor.permissao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CadastroUsuarios;
