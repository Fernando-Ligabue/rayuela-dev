import React, { useState } from "react";
import { X } from "lucide-react";
// import axios from "axios";
import { toast } from "react-toastify";
import classes from "./Feedback.module.css";
import { FEEDBACK_ICON } from "../../utils/constants";
const Feedback = () => {
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setFeedback("");
    setShowModal(false);
  }

  const handleFeedbackChange = (e) => {
    const value = e.target.value;
    setFeedback(value);
    setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (feedback.length === 0) {
      toast.warning("Por favor, escreva seu feedback.");
      return;
    }

    const data = {
      message: feedback,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/grava-feedback`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": window.__REACT_APP_NONCE__,
      },
      body: JSON.stringify(data),
    })

      if (response.status === 200) {
        toast.success("Feedback enviado com sucesso!");
        setFeedback("");
        handleClose();
      }
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Ocorreu um erro ao enviar seu feedback. Tente novamente.");
    }
  };

  return (
    <>
      <div className={classes.feedbackIcon} onClick={handleShow}>
        <img src={FEEDBACK_ICON} alt="Feedback Icon" />
      </div>

      {showModal && (
        <div className={classes.modalOverlay}>
          <div className={classes.modalContent}>
            <div className={classes.modalHeader}>
              <h4>
                Deixe o seu feedback e partilhe as experiências dos seus grupos
              </h4>
              <button className={classes.closeButton} onClick={handleClose}>
                <X className={classes.iconClose} />
              </button>
            </div>
            <div className={classes.modalBody}>
              <textarea
                className={classes.textArea}
                value={feedback}
                maxLength={200}
                onChange={handleFeedbackChange}
                placeholder="Escreva seu feedback aqui..."
              />
            </div>
            <div className={classes.modalFooter}>
              <p className={classes.charCount}>{charCount}/200</p>
              <button className={classes.submitButton} onClick={handleSubmit}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feedback;
