import React, { useState, useEffect } from "react";

import classes from "./questionario.module.css";

const Questionario = ({
  initialData = {},
  onQuestionarioChange,
  novo = false,
}) => {
  const [resposta1, setResposta1] = useState("");
  const [resposta2, setResposta2] = useState("");
  const [resposta3, setResposta3] = useState("");
  const [resposta4, setResposta4] = useState("");
  const [crimeVitima, setCrimeVitima] = useState("");
  const [crimeAutor, setCrimeAutor] = useState("");
  // Atualiza os estados apenas uma vez com initialData
  useEffect(() => {
    if (!novo) {
      setResposta1(initialData.questao1 || "");
      setResposta2(initialData.questao2 || "");
      setResposta3(initialData.questao3 || "");
      setResposta4(initialData.questao4 || "");
      setCrimeVitima(initialData.questao5 || "");
      setCrimeAutor(initialData.questao6 || "");
    }
  }, [initialData, novo]);

  // Atualiza o componente pai sempre que os estados mudam
  useEffect(() => {
    const respostas = {
      questao1: resposta1,
      questao2: resposta2,
      questao3: resposta3,
      questao4: resposta4,
      questao5: crimeVitima,
      questao6: crimeAutor,
    };
    onQuestionarioChange(respostas);
  }, [resposta1, resposta2, resposta3, resposta4, crimeVitima, crimeAutor]);

  console.log("InitialData: " + JSON.stringify(initialData));

  return (
    <fieldset className={classes.containerQuestion}>
      <legend className={classes.legendQuestion}>Questionário de Aplicação</legend>

      <label className={classes.labelQuestion}>
        O grupo gostou de jogar o jogo/aventura(s):
        <select
          className={classes.selectQuestion}
          value={resposta1}
          onChange={(e) => setResposta1(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="1">Discordo totalmente</option>
          <option value="2">Discordo</option>
          <option value="3">Indiferente</option>
          <option value="4">Concordo</option>
          <option value="5">Concordo totalmente</option>
        </select>
      </label>

      <label className={classes.labelQuestion}>
        A narrativa da(s) aventura(s) é adequada ao conteúdo educativo:
        <select
          className={classes.selectQuestion}
          value={resposta2}
          onChange={(e) => setResposta2(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="1">Discordo totalmente</option>
          <option value="2">Discordo</option>
          <option value="3">Indiferente</option>
          <option value="4">Concordo</option>
          <option value="5">Concordo totalmente</option>
        </select>
      </label>

      <label className={classes.labelQuestion}>
        A história do jogo/aventura(s) reflete adequadamente os fenómenos de
        cibercrime abordados:
        <select
          className={classes.selectQuestion}
          value={resposta3}
          onChange={(e) => setResposta3(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="1">Discordo totalmente</option>
          <option value="2">Discordo</option>
          <option value="3">Indiferente</option>
          <option value="4">Concordo</option>
          <option value="5">Concordo totalmente</option>
        </select>
      </label>

      <label className={classes.labelQuestion}>
        Como avalia a navegação pelo jogo/aventura(s):
        <select
          className={classes.selectQuestion}
          value={resposta4}
          onChange={(e) => setResposta4(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="1">Muito difícil</option>
          <option value="2">Difícil</option>
          <option value="3">Adequada</option>
          <option value="4">Fácil</option>
          <option value="5">Muito fácil</option>
        </select>
      </label>

      <div className={classes.questionsMark}>
        Durante o jogo/aventura(s), pelo menos, um menor reportou ter sido
        vítima de um crime/cibercrime?
        <label>
          <input
            className={classes.inputQuestion}
            type="radio"
            name="crimeVítima"
            value="Sim"
            checked={crimeVitima === "Sim"}
            onChange={(e) => setCrimeVitima(e.target.value)}
          />{" "}
          Sim
        </label>
        <label>
          <input
            className={classes.inputQuestion}
            type="radio"
            name="crimeVítima"
            value="Não"
            checked={crimeVitima === "Não"}
            onChange={(e) => setCrimeVitima(e.target.value)}
          />{" "}
          Não
        </label>
      </div>

      <div>
        Durante o jogo/aventura(s), pelo menos, um menor reportou ter sido autor
        ou coautor de um crime/cibercrime?
        <label>
          <input
            type="radio"
            name="crimeAutor"
            value="Sim"
            checked={crimeAutor === "Sim"}
            onChange={(e) => setCrimeAutor(e.target.value)}
          />{" "}
          Sim
        </label>
        <label>
          <input
            type="radio"
            name="crimeAutor"
            value="Não"
            checked={crimeAutor === "Não"}
            onChange={(e) => setCrimeAutor(e.target.value)}
          />{" "}
          Não
        </label>
      </div>
    </fieldset>
  );
};

export default Questionario;
