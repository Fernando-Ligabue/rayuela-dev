import React, { useState } from "react";
import { toast } from "react-toastify";

import classes from "./contacto.module.css";

const Contacto = () => {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmitForm = (e) => {
    e.preventDefault();

    const data = {
      topic: topic,
      subject: subject,
      message: message,
    };

    if(data.topic === "" || data.subject === "" || data.message === "") {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/grava-contato`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": window.__REACT_APP_NONCE__,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast.success("Mensagem enviada com sucesso!");
        setTopic("");
        setSubject("");
        setMessage("");
      })
      .catch((error) => {
        toast.error("Ocorreu um erro ao enviar a sua mensagem.");
        console.error("Error:", error);
      });
  };

  return (
    <div className={classes.containerContacto}>
      <form onSubmit={handleSubmitForm} className={classes.formContactPage}>
        <h1>Deixe nos uma mensagem</h1>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">Selecione um tópico</option>
          <option value="Suporte técnico: site">Suporte técnico: site</option>
          <option value="Suporte técnico: download, instalação e execução do jogo">
            Suporte técnico: download, instalação e execução do jogo
          </option>
          <option value="Suporte operacional: aplicação do jogo e materiais didáticos">
            Suporte operacional: aplicação do jogo e materiais didáticos
          </option>
          <option value="Esclarecimentos adicionais para situações de risco identificadas durante as sessões do jogo">
            Esclarecimentos adicionais para situações de risco
          </option>
          <option value="Sugestões">Sugestões</option>
          <option value="Outros Assuntos">Outros Assuntos</option>
        </select>
        <label htmlFor="subject">ASSUNTO</label>
        <input
          type="text"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <label htmlFor="message">MENSAGEM</label>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit" className={classes.btnSubmitContacto}>
          SUBMETER
        </button>
      </form>
    </div>
  );
};

export default Contacto;
