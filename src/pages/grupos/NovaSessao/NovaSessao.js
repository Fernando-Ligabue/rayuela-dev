import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classes from "./nova-sessao.module.css";
import { toast } from "react-toastify";
import { ChevronLeft, X } from "lucide-react";
import Questionario from "../../../components/Questionario/Questionario";

const NovaSessao = () => {
  const { grupo_id } = useParams();
  const navigate = useNavigate();

  const [dataSession, setDataSession] = useState("");
  const [duracao, setDuracao] = useState("");
  const [numeroAlunos, setNumeroAlunos] = useState("");
  const [aventurasJogadas, setAventurasJogadas] = useState([]);
  const [questionario, setQuestionario] = useState({});
  const [sessaoFiles, setSessaoFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuestionarioChange = (respostas) => {
    setQuestionario(respostas);
  };

  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/png",
    "image/jpeg",
  ];
  const maxFileSize = 1048576;
  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);

    const validFiles = fileList.filter(
      (file) => allowedFileTypes.includes(file.type) && file.size <= maxFileSize
    );

    const invalidFiles = fileList.filter(
      (file) => !allowedFileTypes.includes(file.type) || file.size > maxFileSize
    );

    if (invalidFiles.length > 0) {
      const invalidFileMessages = invalidFiles.map((file) => {
        const typeError = !allowedFileTypes.includes(file.type)
          ? "Tipo de ficheiro invalido"
          : "";
        const sizeError =
          file.size > maxFileSize
            ? "Ficheiro excede o tamanho máximo. (max 1MB)"
            : "";
        return `${file.name}: ${typeError} ${sizeError}`.trim();
      });

      toast.error(
        `Não é possível anexar este ficheiro:\n\n${invalidFileMessages.join(
          "\n"
        )}`
      );
    }

    setSessaoFiles([...sessaoFiles, ...validFiles]);
  };

  const handleRemoveFile = (filename) => {
    setSessaoFiles(sessaoFiles.filter((file) => file.name !== filename));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAventurasJogadas((prev) => [...prev, value]);
    } else {
      setAventurasJogadas((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //if (!dataSession || !duracao || !numeroAlunos || !questionario) {
    if (!dataSession || !duracao || !numeroAlunos) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setErrorMessage("");

    // Preparar os dados como JSON antes de enviar
    const questionarioJson = JSON.stringify(questionario);
    const formData = new FormData();
    formData.append("grupo_id", grupo_id);
    formData.append("dataSession", dataSession);
    formData.append("duracao", duracao);
    formData.append("numero_alunos", numeroAlunos);
    formData.append("aventuras_jogadas", aventurasJogadas.join(","));
    // formData.append("questionario", questionario);
    formData.append("questionario", questionarioJson);

    for (let i = 0; i < sessaoFiles.length; i++) {
      formData.append("sessao_files[]", sessaoFiles[i]);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/perfilb/v1/grava-sessao`,
        {
          method: "POST",
          // credentials: "include",
          // headers: {
          //   "X-WP-Nonce": window.__REACT_APP_NONCE__,
          // },
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Sessão registrada com sucesso!");
        navigate(`/sessoes/${grupo_id}`);
      } else {
        toast.error("Ocorreu um erro ao registrar a sessão.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocorreu um erro ao enviar os dados.");
    }
  };

  const handleBackPage = () => {
    navigate(`/grupos`);
  };

  return (
    <div className={classes.formContainer}>
      <div className={classes.headerNewSession}>
        <ChevronLeft className={classes.iconBack} onClick={handleBackPage} />
        <h1>
          NOVA SESSÃO <br />{" "}
          <span className={classes.accent}>Grupo ID: {grupo_id}</span>
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className={classes.formNewSession}
      >
        <div className={classes.wrapperForm}>
          <div className={classes.formLeft}>
            <div className={classes.formGroup}>
              <input
                type="date"
                id="data"
                name="dataSession"
                placeholder="DATA"
                value={dataSession}
                onChange={(e) => setDataSession(e.target.value)}
                required
              />
            </div>

            <div className={`${classes.formGroup} ${classes.duration}`}>
              <input
                type="number"
                id="duracao"
                name="duracao"
                placeholder="DURAÇÃO DA SESSÃO (MINUTOS)"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className={`${classes.formGroup} ${classes.numberPersons}`}>
              <input
                type="number"
                id="numero-alunos"
                name="numero-alunos"
                placeholder="NÚMERO DE ALUNOS"
                value={numeroAlunos}
                onChange={(e) => setNumeroAlunos(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className={`${classes.formGroup} ${classes.adventures}`}>
              <label className="adv-label">AVENTURAS JOGADAS:</label>
              <div className="checkbox-group">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <label key={num}>
                    <input
                      type="checkbox"
                      name="aventuras-jogadas"
                      value={num}
                      onChange={handleCheckboxChange}
                    />{" "}
                    {num}
                  </label>
                ))}
              </div>
            </div>
            <div className={`${classes.formGroup} ${classes.ficheiros}`}>
              <div className={classes.customFileInputWrapper}>
                <input
                  type="file"
                  id="sessao_files"
                  name="sessao_files"
                  multiple
                  onChange={handleFileChange}
                  className={classes.customFileInput}
                />
                <label
                  htmlFor="sessao_files"
                  className={classes.customFileLabel}
                >
                  UPLOAD DE FICHEIROS
                </label>
                <button type="button" className={classes.customUploadButton}>
                  ESCOLHER FICHEIROS
                </button>
              </div>
              <small className={classes.filename}>
                {sessaoFiles.length > 0
                  ? sessaoFiles.map((file, index) => (
                      <div className={classes.removeFile} key={index}>
                        {file.name}
                        <X
                          className={classes.x}
                          size={10}
                          onClick={() => handleRemoveFile(file.name)}
                        />
                      </div>
                    ))
                  : "Nenhum arquivo selecionado"}
              </small>
            </div>
          </div>
          <div className={classes.formRight}>
            <Questionario
              onQuestionarioChange={handleQuestionarioChange}
              novo={true}
            />
          </div>
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <div className={`${classes.formGroup} ${classes.btnSubmitS}`}>
          <button
            type="submit"
            name="submit_sessao"
            className={classes.btnSubmitSession}
          >
            REGISTAR SESSÃO
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovaSessao;
