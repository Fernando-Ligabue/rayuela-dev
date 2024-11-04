import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NovoButton from "../../../components/buttons/NovoButton";
import Loader from "../../../components/Loader/Loader";

import { ChevronLeft, Edit, Trash2 } from "lucide-react";

import classes from "./sessoes.module.css";
import { toast } from "react-toastify";

import ExcelExport from "../../../components/ExportButton/ExportButton";

import { useRef } from "react";
import generatePDF from "react-to-pdf";

const Sessoes = () => {
  const { grupo_id } = useParams();
  const { sessao_id } = useParams();
  const [sessoes, setSessoes] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const navigate = useNavigate();
  const targetRef = useRef();

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `${process.env.REACT_APP_API_URL}/perfilb/v1/sessoes?grupo_id=${grupo_id}`,
      {
        method: "GET",
        // credentials: "include",
        // headers: {
        //    "X-WP-Nonce": window.__REACT_APP_NONCE__,
        // },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setSessoes(data);
        } else {
          setError("Nenhuma sessão encontrada para este grupo.");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar as sessões:", error);
        setError("Erro ao carregar os dados.");
      });
  }, [grupo_id]);

  const handleBackPage = () => {
    navigate("/grupos");
  };

  const handleDelete = (id) => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/apaga-sessao/${id}`, {
      method: "PUT",
      // credentials: "include",
      // headers: {
      //   "X-WP-Nonce": window.__REACT_APP_NONCE__,
      // },
    })
      .then((response) => {
        toast.success("Grupo excluído com sucesso");
        return response.json();
      })
      .then((data) => {
        fetch(
          `${process.env.REACT_APP_API_URL}/perfilb/v1/sessoes?grupo_id=${grupo_id}`,
          {
            method: "GET",
            // credentials: "include",
            // headers: {
            //   "X-WP-Nonce": window.__REACT_APP_NONCE__,
            // },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data && data.length > 0) {
              setSessoes(data);
            } else {
              setError("Nenhuma sessão encontrada para este grupo.");
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Erro ao buscar as sessões:", error);
            setError("Erro ao carregar os dados.");
          });
      })
      .catch((error) => {
        toast.error("Error fetching the Sessões Escola data:", error);
        setError("Erro ao carregar dados.");
        setIsLoading(false);
        setOpenModal(false);
      });
  };

  const handleOpenModal = (id) => {
    setSelectedSessionId(id);
    setOpenModal(true);
  };

  return (
    <div className={classes.containerSessions}>
      <h1>
        Sessões <br />{" "}
        <span className={classes.accent}>Grupo ID: {grupo_id}</span>
      </h1>
      <div className={classes.wrapperHeaderSessions}>
        <div className={classes.headerSessions}>
          <div className={classes.buttonContainer}>
          <div className={classes.arrowBackContainer}>
            <ChevronLeft
              className={classes.arrowBack}
              onClick={handleBackPage}
            />
            <NovoButton title="Nova Sessão" to={`/nova-sessao/${grupo_id}`} />
            </div>
            <div className={classes.exportBtns}>
              <ExcelExport data={sessoes} fileName="grupos" />
              <button
                className={classes.button}
                onClick={() =>
                  generatePDF(targetRef, { filename: "sessoes.pdf" })
                }
              >
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.sessionsTableWrapper}>
        <table className={classes.sessionsTable}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Duração</th>
              <th>Nº de Alunos</th>
              <th>Aventuras Jogadas</th>
              {/* <th>Questionário</th> */}
              <th>Ficheiros</th>
              <th style={{ textAlign: "center", width: "85px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  <Loader />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7">{error}</td>
              </tr>
            ) : sessoes.length > 0 ? (
              sessoes.map((sessao) => (
                <tr key={sessao.id}>
                  <td>{sessao.data}</td>
                  <td>{sessao.duracao}</td>
                  <td>{sessao.numero_alunos}</td>
                  <td>{sessao.aventuras_jogadas}</td>
                  {/* <td>{sessao.questionario}</td> */}
                  <td className={classes.filesField}>
                    {sessao.uploaded_files.length > 0
                      ? sessao.uploaded_files.map((file, index) => {
                          const fileName = file.split("/").pop();
                          return (
                            <a
                              key={file}
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span>{index + 1} - </span> {fileName} <br />
                            </a>
                          );
                        })
                      : "Nenhum arquivo enviado"}
                  </td>
                  <td
                    className={classes.fieldActions}
                    style={{ textAlign: "center", width: "85px" }}
                  >
                    <div className={classes.wrapperIconsActions}>
                      <Trash2
                        size={24}
                        className={classes.delete}
                        onClick={() => handleOpenModal(sessao.id)}
                      />
                      <Edit
                        size={24}
                        className={classes.edit}
                        onClick={() => navigate(`/edita-sessao/${sessao.id}`)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhuma sessão encontrada para este grupo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {openModal && (
        <div className={classes.modal}>
          <div className={classes.modalContent}>
            <h4>Confirma a exclusão desta sessão?</h4>
            <div className={classes.modalBtnWrapper}>
              <button
                className={classes.confirm}
                onClick={() => {
                  handleDelete(selectedSessionId);
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

export default Sessoes;
