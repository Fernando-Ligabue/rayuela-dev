import React, { useState } from "react";
import { toast } from "react-toastify";

import classes from "./feedback.module.css";

const FeedbackPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [cibercrimeLearning, setCibercrimeLearning] = useState([]);
  const [gameDuration, setGameDuration] = useState([]);
  const [rayuelaUsefulness, setRayuelaUsefulness] = useState([]);
  const [curriculumIntegration, setCurriculumIntegration] = useState([]);
  const [suggestionGame, setSuggestionGame] = useState("");
  const [suggestionProject, setSuggestionProject] = useState("");

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    const data = {
      subject,
      message,
      cibercrimeLearning,
      gameDuration,
      rayuelaUsefulness,
      curriculumIntegration,
      suggestionGame,
      suggestionProject,
    };

    fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/grava-feedback`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": window.__REACT_APP_NONCE__,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Mensagem enviada com sucesso!");
        setSubject("");
        setMessage("");
        setCibercrimeLearning([]);
        setGameDuration([]);
        setRayuelaUsefulness([]);
        setCurriculumIntegration([]);
        setSuggestionGame("");
        setSuggestionProject("");
      })
      .catch((error) => {
        toast.error("Ocorreu um erro ao enviar a sua mensagem.");
        console.error("Error:", error);
      });
  };

  return (
    <div className={classes.containerFeedback}>
      <form onSubmit={handleSubmitForm} className={classes.formFeedbackPage}>
        <h1>Deixe nos seu Feedback acerca do Jogo.</h1>

        <label className={classes.labelFeedback} htmlFor="subject">APLICADOR DO JOGO</label>
        <input
          type="text"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <label className={classes.labelFeedback}>Considera que os jogadores aprenderam algo novo sobre cibercrime?</label>
        <div className={classes.checkboxGroup}>
          {["Discordo totalmente", "Discordo", "Indiferente", "Concordo", "Concordo totalmente"].map(option => (
            <div key={option}>
              <input
                type="checkbox"
                id={option}
                value={option}
                checked={cibercrimeLearning.includes(option)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...cibercrimeLearning, option]
                    : cibercrimeLearning.filter(item => item !== option);
                  setCibercrimeLearning(newValues);
                }}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>

        <label className={classes.labelFeedback}>A duração do jogo é adequada?</label>
        <div className={classes.checkboxGroup}>
          {["Muito curta", "Curta", "Adequada", "Longa", "Muito longa"].map(option => (
            <div key={option}>
              <input
                type="checkbox"
                id={option}
                value={option}
                checked={gameDuration.includes(option)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...gameDuration, option]
                    : gameDuration.filter(item => item !== option);
                  setGameDuration(newValues);
                }}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>

        <label className={classes.labelFeedback}>O jogo RAYUELA é útil nas escolas:</label>
        <div className={classes.checkboxGroup}>
          {["Discordo totalmente", "Discordo", "Indiferente", "Concordo", "Concordo totalmente"].map(option => (
            <div key={option}>
              <input
                type="checkbox"
                id={option}
                value={option}
                checked={rayuelaUsefulness.includes(option)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...rayuelaUsefulness, option]
                    : rayuelaUsefulness.filter(item => item !== option);
                  setRayuelaUsefulness(newValues);
                }}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>

        <label className={classes.labelFeedback}>O jogo RAYUELA deve integrar o currículo escolar:</label>
        <div className={classes.checkboxGroup}>
          {["Discordo totalmente", "Discordo", "Indiferente", "Concordo", "Concordo totalmente"].map(option => (
            <div key={option}>
              <input
                type="checkbox"
                id={option}
                value={option}
                checked={curriculumIntegration.includes(option)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...curriculumIntegration, option]
                    : curriculumIntegration.filter(item => item !== option);
                  setCurriculumIntegration(newValues);
                }}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>

        <label className={classes.labelFeedback} htmlFor="suggestionGame">Tem algum comentário ou sugestão para melhorar o jogo?</label>
        <textarea
          id="suggestionGame"
          value={suggestionGame}
          onChange={(e) => setSuggestionGame(e.target.value)}
        ></textarea>

        <label className={classes.labelFeedback} htmlFor="suggestionProject">Tem algum comentário ou sugestão para melhorar o projeto de aplicação do jogo em Portugal?</label>
        <textarea
          id="suggestionProject"
          value={suggestionProject}
          onChange={(e) => setSuggestionProject(e.target.value)}
        ></textarea>

        <button type="submit" className={classes.btnSubmitFeedback}>
          SUBMETER
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;
