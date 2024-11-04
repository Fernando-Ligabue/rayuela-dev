import React, { useEffect, useState } from "react";
import NovoButton from "../../../components/buttons/NovoButton";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import classes from "./lista-grupo.module.css";
import { Check, ChevronLeft, CircleX, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ExcelExport from "../../../components/ExportButton/ExportButton";

import { useRef } from "react";
import generatePDF from "react-to-pdf";

// Your Component
const ListaGrupos = () => {
  const [grupoEscolaData, setGrupoEscolaData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const navigate = useNavigate();

  const targetRef = useRef();
  const handleDelete = (id) => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/apaga-grupo/${id}`, {
      method: "PUT",
      // credentials: "include",
      // headers: {
      //   "X-WP-Nonce": window.__REACT_APP_NONCE__,
      // },
    })
      .then((response) => {
        toast.success("Grupo excluído com sucesso.");
        return response.json();
      })
      .then((data) => {
        fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/lista-grupos`, {
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
            setGrupoEscolaData(data);
            setIsLoading(false);
            setOpenModal(false);
          })
          .catch((error) => {
            toast.error("Erro ao carregar listagem de grupos:", error);
            setError("Erro ao carregar dados.");
            setIsLoading(false);
            setOpenModal(false);
          });
      })
      .catch((error) => {
        toast.error("Erro ao carregar listagem de grupos:", error);
        setError("Erro ao carregar dados.");
        setIsLoading(false);
        setOpenModal(false);
      });
  };

  const handleCloseGroup = (id) => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/fecha-grupo/${id}`, {
      method: "PUT",
      // credentials: "include",
      // headers: {
      //   "X-WP-Nonce": window.__REACT_APP_NONCE__,
      // },
    })
      .then((response) => {
        toast.success("Grupo modificado com sucesso.");
        return response.json();
      })
      .then((data) => {
        fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/lista-grupos`, {
          method: "GET",
          credentials: "include",
          headers: {
            "X-WP-Nonce": window.__REACT_APP_NONCE__,
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setGrupoEscolaData(data);
            setIsLoading(false);
            setOpenModal(false);
          })
          .catch((error) => {
            toast.error("Erro ao carregar listagem de grupos:", error);
            setError("Erro ao carregar dados.");
            setIsLoading(false);
            setOpenModal(false);
          });
      })
      .catch((error) => {
        toast.error("Erro ao carregar listagem de grupos:", error);
        setError("Erro ao carregar dados.");
        setIsLoading(false);
        setOpenModal(false);
      });
  };

  const handleOpenModal = (id) => {
    setSelectedGroupId(id);
    setOpenModal(true);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/lista-grupos`, {
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
        setGrupoEscolaData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar listagem de grupos:", error);
        setError("Erro ao carregar dados.");
        setIsLoading(false);
      });
  }, []);

  const handleBackPage = () => {
    navigate("/professores/rayuela-professores");
  };

  return (
    <>
      <div className={classes.containerLista}>
        <ChevronLeft className={classes.iconBack} onClick={handleBackPage} />
        <h1>Lista de Grupos Escola</h1>
        <div className={classes.buttonContainer}>
          <NovoButton title="Novo Grupo" to="/novo-grupo" />
          <div className={classes.exportBtns}>
            <ExcelExport data={grupoEscolaData} fileName="grupos" />
            <button
              className={classes.button}
              onClick={() => generatePDF(targetRef, { filename: "grupos.pdf" })}
            >
              Exportar PDF
            </button>
          </div>
        </div>
        <div className={classes.tableWrapper}>
          <table className={classes.grupoEscolaTable} ref={targetRef}>
            <thead>
              <tr>
                <th>Escola</th>
                <th>Ano Curricular</th>
                <th>Identificação de Grupo</th>
                <th>Disciplina</th>
                <th>Número de Alunos</th>
                <th>Sessões</th>
                <th style={{ textAlign: "center", width: "85px" }}>Ações</th>
                <th style={{ textAlign: "center", width: "110px" }}>
                  Fechar Grupo
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", border: "none" }}
                  >
                    <Loader />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6">{error}</td>
                </tr>
              ) : grupoEscolaData.length > 0 ? (
                grupoEscolaData.map((grupo) => (
                  <tr key={grupo.id}>
                    <td>{grupo.escola_nome}</td>
                    <td>{grupo.ano_curricular}</td>
                    <td>{grupo.identificacao_grupo}</td>
                    <td>{grupo.disciplina}</td>
                    <td>{grupo.numero_alunos}</td>
                    <td className={classes.wrapperActions}>
                      <div>
                        {grupo.fechado === "1" ? (
                          <span
                            className={`${classes.btnSession} ${classes.groupClosed}`}
                          >
                            Fechado
                          </span>
                        ) : (
                          <Link
                            to={`/nova-sessao/${grupo.id}`}
                            className={classes.btnSession}
                          >
                            Nova sessão
                          </Link>
                        )}

                        {grupo.fechado === "1" ? (
                          <span
                            className={`${classes.btnSession} ${classes.groupClosed}`}
                          >
                            Fechado
                          </span>
                        ) : (
                          <Link
                            to={`/sessoes/${grupo.id}`}
                            className={classes.btnSession}
                          >
                            Sessões
                          </Link>
                        )}
                      </div>
                    </td>
                    <td
                      className={classes.fieldActions}
                      style={{ textAlign: "center", width: "85px" }}
                    >
                      <div className={classes.wrapperIconsActions}>
                        <Trash2
                          size={24}
                          className={classes.delete}
                          onClick={() => handleOpenModal(grupo.id)}
                        />
                        <Edit
                          size={24}
                          className={classes.edit}
                          onClick={() => navigate(`/editar-grupo/${grupo.id}`)}
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: "center", width: "110px" }}>
                      {grupo.fechado === "0" ? (
                        <CircleX
                          size={24}
                          className={classes.closed}
                          onClick={() => handleCloseGroup(grupo.id)}
                        />
                      ) : (
                        <Check
                          size={24}
                          className={classes.open}
                          onClick={() => handleCloseGroup(grupo.id)}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Nenhum grupo de escolas encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <div className={classes.modal}>
          <div className={classes.modalContent}>
            <h4>Confirma a exclusão deste grupo?</h4>
            <div className={classes.modalBtnWrapper}>
              <button
                className={classes.confirm}
                onClick={() => {
                  handleDelete(selectedGroupId);
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
    </>
  );
};

export default ListaGrupos;
