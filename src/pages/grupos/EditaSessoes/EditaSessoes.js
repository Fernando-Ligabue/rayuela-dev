/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classes from "./edita-sessao.module.css";
import { toast } from "react-toastify";
import { ChevronLeft, X } from "lucide-react";
import Questionario from "../../../components/Questionario/Questionario";

const EditaSessao = () => {
  const navigate = useNavigate();
  const { sessao_id } = useParams();

  const [dataSession, setDataSession] = useState(null);
  const [duracao, setDuracao] = useState(null);
  const [numeroAlunos, setNumeroAlunos] = useState(null);
  const [aventurasJogadas, setAventurasJogadas] = useState([]);
  const [questionario, setQuestionario] = useState(null);
  const [sessaoFiles, setSessaoFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [fileToRemove, setFileToRemove] = useState(null);

  const handleQuestionarioChange = (respostas) => {
    setQuestionario(respostas);
  };

  const [editData, setEditData] = useState({
    group_id: "",
    data: "",
    duracao: "",
    numero_alunos: "",
    aventuras_jogadas: "",
    //questionario: "",
    uploaded_files: "",
    hide: 0,
  });

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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const numValue = parseInt(value, 10);

    if (checked) {
      setAventurasJogadas((prev) => {
        if (!prev.includes(numValue)) {
          return [...prev, numValue];
        }
        return prev;
      });
    } else {
      setAventurasJogadas((prev) => prev.filter((v) => v !== numValue));
    }
  };

  const handleRemoveNewFile = (fileName) => {
    setSessaoFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleRemoveUploadedFile = async (fileUrl, grupoId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/perfilb/v1/apaga-ficheiro/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // "X-WP-Nonce": window.__REACT_APP_NONCE__,
          },
          body: JSON.stringify({
            file_url: fileUrl,
            grupo_id: grupoId,
            session_id: sessao_id,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Ficheiro removido com sucesso.");
        // Atualiza a lista de uploadedFiles removendo o arquivo deletado
        setUploadedFiles((prevFiles) =>
          prevFiles.filter((file) => file !== fileUrl)
        );
      } else {
        toast.error("Falha ao excluir o ficheiro:", result.message);
      }
    } catch (error) {
      console.error("Error while deleting file:", error);
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/sessao/${sessao_id}`, {
      method: "GET",
      // credentials: "include",
      // headers: {
      //   "X-WP-Nonce": window.__REACT_APP_NONCE__,
      // },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("GroupID:", data.grupo_id);
        setEditData({
          group_id: data.grupo_id,
          data: data.data,
          duracao: data.duracao,
          numero_alunos: data.numero_alunos,
          aventuras_jogadas: data.aventuras_jogadas,
          //questionario: data.questionario,
          uploaded_files: data.uploaded_files,
        });
        //console.log("JSON questionario: " + data.questionario);
        setQuestionario(JSON.parse(data.questionario));
        if (data.aventuras_jogadas) {
          const aventurasArray = data.aventuras_jogadas.split(",").map(Number);
          setAventurasJogadas(aventurasArray);
        }

        if (data.uploaded_files) {
          const uploadedFilesArray = data.uploaded_files.split(",");
          setUploadedFiles(uploadedFilesArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching the Sessao :", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({
      dataSession:
        dataSession == null ? editData.data === "" : dataSession === "",
      duracao: duracao == null ? editData.duracao === "" : duracao === "",
      numeroAlunos:
        numeroAlunos == null
          ? editData.numero_alunos === ""
          : numeroAlunos === "",
      aventurasJogadas:
        aventurasJogadas == null
          ? editData.aventuras_jogadas.length === 0
          : aventurasJogadas.length === 0,
      questionario:
        questionario == null
          ? editData.questionario === ""
          : questionario === "",
    });
    // Validate required fields
    if (
      (dataSession == null ? editData.data === "" : dataSession === "") ||
      (duracao == null ? editData.duracao === "" : duracao === "") ||
      (numeroAlunos == null
        ? editData.numero_alunos === ""
        : numeroAlunos === "") ||
      (aventurasJogadas == null
        ? editData.aventuras_jogadas.length === 0
        : aventurasJogadas.length === 0) /*||
      (questionario == null ? editData.questionario === '' : questionario === '')*/
    ) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setErrorMessage("");

    // Prepare FormData
    const formData = new FormData();
    formData.append("session_id", sessao_id);
    formData.append("grupo_id", editData.group_id);
    formData.append(
      "dataSession",
      dataSession == null ? editData.data : dataSession
    );
    formData.append("duracao", duracao == null ? editData.duracao : duracao);
    formData.append(
      "numero_alunos",
      numeroAlunos == null ? editData.numero_alunos : numeroAlunos
    );
    formData.append(
      "aventuras_jogadas",
      aventurasJogadas == null
        ? editData.aventuras_jogadas
        : aventurasJogadas.join(",")
    );
    const questionarioJson = JSON.stringify(questionario);
    formData.append(
      "questionario",
      //questionario == null ? editData.questionario : questionario
      questionarioJson
    );

    const existingFiles = editData.sessaoFiles || [];
    const newFiles = [...existingFiles, ...sessaoFiles];

    for (let i = 0; i < newFiles.length; i++) {
      formData.append("sessao_files[]", newFiles[i]);
    }

    console.log(formData);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/perfilb/v1/edita-sessao/${sessao_id}`,
        {
          method: "POST",
          /*credentials: "include",
          headers: {
            "X-WP-Nonce": window.__REACT_APP_NONCE__,
          },*/
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Sessão atualizada com sucesso.");
        navigate(`/sessoes/${editData.group_id}`);
      } else {
        toast.error("Ocorreu um erro ao atualizar a sessão.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocorreu um erro ao enviar os dados.");
    }
  };

  const handleBackPage = () => {
    navigate(`/sessoes/${editData.group_id}`);
  };

  return (
    <div className={classes.formContainer}>
      <div className={classes.headerNewSession}>
        <ChevronLeft className={classes.iconBack} onClick={handleBackPage} />
        <h1>
          EDITAR SESSÃO <br />{" "}
          <span className={classes.accent}>Sessão ID: {sessao_id}</span>
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
                value={dataSession == null ? editData.data : dataSession}
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
                value={duracao == null ? editData.duracao : duracao}
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
                value={
                  numeroAlunos == null ? editData.numero_alunos : numeroAlunos
                }
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
                      checked={aventurasJogadas.includes(num)}
                      onChange={handleCheckboxChange}
                    />
                    {num}
                  </label>
                ))}
              </div>
            </div>

            {/* <div className={`${classes.formGroup} ${classes.textarea}`}>
          <textarea
            id="questionario"
            name="questionario"
            rows="4"
            placeholder="BREVE QUESTIONÁRIO DE APLICAÇÃO"
            value={ questionario == null ? editData.questionario : questionario}
            onChange={(e) => setQuestionario(e.target.value)}
            required
          ></textarea>
        </div> */}

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
                {sessaoFiles.length > 0 || uploadedFiles.length > 0 ? (
                  <>
                    {sessaoFiles.map((file, index) => (
                      <div className={classes.removeFile} key={`new-${index}`}>
                        {file.name}
                        <X
                          className={classes.x}
                          size={10}
                          onClick={() => handleRemoveNewFile(file.name)}
                        />
                      </div>
                    ))}

                    {uploadedFiles.map((fileUrl, index) => (
                      <div
                        className={classes.removeFile}
                        key={`uploaded-${index}`}
                      >
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {fileUrl.split("/").pop()}{" "}
                        </a>
                        <X
                          className={classes.x}
                          size={10}
                          onClick={() => {
                            setFileToRemove(fileUrl);
                            setOpenModal(true);
                          }}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  "Nenhum arquivo selecionado"
                )}
              </small>
            </div>
          </div>
          <div className={classes.formRight}>
            <Questionario
              initialData={questionario ? questionario : {}}
              onQuestionarioChange={handleQuestionarioChange}
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
            GRAVAR EDIÇÃO
          </button>
        </div>
      </form>

      {openModal && (
        <div className={classes.modal}>
          <div className={classes.modalContent}>
            <h4>Confirma a exclusão deste grupo?</h4>
            <div className={classes.modalBtnWrapper}>
              <button
                className={classes.confirm}
                onClick={() => {
                  handleRemoveUploadedFile(fileToRemove);
                  setOpenModal(false);
                }}
              >
                Confirmar
              </button>
              <button
                className={classes.cancel}
                onClick={() => setOpenModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EditaSessao;
