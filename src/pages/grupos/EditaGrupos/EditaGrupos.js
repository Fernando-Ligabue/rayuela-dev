/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import classes from "./edita-grupos.module.css";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
// Define the Dropdown component
const Dropdown = ({
  id,
  label,
  options,
  onSelect,
  selectedValue,
  isOpen,
  onToggle,
}) => {
  const handleSelect = (value) => {
    onSelect(value);
    onToggle(false); // Close the dropdown after selection
  };

  return (
    <div>
      <div id={id} className={classes.dropdown}>
        <div
          className={classes.dropdownSelectedText}
          onClick={() => onToggle(!isOpen)}
        >
          {selectedValue || `${label}`}
        </div>
        {isOpen && (
          <div className={classes.dropdownItems}>
            {options.map((option, index) => (
              <div
                key={index}
                className={classes.dropdownItem}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Define the DropdownEscolas component
const DropdownEscolas = ({
  id,
  label,
  options,
  onSelect,
  onSelectId,
  selectedValue,
  setIsVisibleEscolaAgrupamento,
  isOpen,
  onToggle,
}) => {
  const handleSelect = (value) => {
    onSelect(value[0]);
    onToggle(false); // Close the dropdown after selection
    if (value[1] === "Agrupada") {
      setIsVisibleEscolaAgrupamento(true);
    } else {
      setIsVisibleEscolaAgrupamento(false);
    }
    onSelectId(value[2]);
  };

  return (
    <div>
      <div id={id} className={classes.dropdown}>
        <div
          className={classes.dropdownSelectedText}
          onClick={() => onToggle(!isOpen)}
        >
          {selectedValue || `${label}`}
        </div>
        {isOpen && (
          <div className={classes.dropdownItems}>
            {options.map((option, index) => (
              <div
                key={index}
                className={classes.dropdownItem}
                data-value={option.value}
                onClick={() =>
                  handleSelect([option.label, option.tipoAgrupamento, option.value])
                }
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Define the TextInput component
const TextInput = ({ id, label, placeholder, value, onChange }) => {
  return (
    <div>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={classes.textInput}
      />
    </div>
  );
};

// Define the NumberInput component
const NumberInput = ({ id, label, placeholder, value, onChange, min }) => {
  return (
    <div>
      <input
        type="number"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={classes.numberInput}
        min={min}
      />
    </div>
  );
};

// Fetch functions
const fetchDistritos = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/rayuela/v1/distritos-protocolo`, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-WP-Nonce": window.__REACT_APP_NONCE__,
    },
  }
  );
  return response.json();
};

const fetchConcelhos = async (distrito) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL
    }/rayuela/v1/concelhos-protocolo?distrito=${encodeURIComponent(distrito)}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-WP-Nonce": window.__REACT_APP_NONCE__,
    },
  }
  );
  return response.json();
};

const fetchEscolas = async (distrito, concelho) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL
    }/rayuela/v1/escolas-protocolo?distrito=${encodeURIComponent(
      distrito
    )}&concelho=${encodeURIComponent(concelho)}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-WP-Nonce": window.__REACT_APP_NONCE__,
    },
  }
  );
  return response.json();
};

// Main Form Component
const EditaGrupos = () => {
  const [distritos, setDistritos] = useState([]);
  const [concelhos, setConcelhos] = useState([]);
  const [escolas, setEscolas] = useState([]);

  const [firstLoad, setFirstLoad] = useState(true);

  const [selectedDistrito, setSelectedDistrito] = useState(null);
  const [selectedConcelho, setSelectedConcelho] = useState(null);
  const [selectedEscola, setSelectedEscola] = useState(null);
  const [selectedEscolaId, setSelectedEscolaId] = useState(null);
  const [escolaAgrupamentoIdentificacao, setEscolaAgrupamentoIdentificacao] =
    useState(null);
  const [selectedAnoCurricular, setSelectedAnoCurricular] = useState(null);
  const [textAnoOutro, setTextAnoOutro] = useState(null);
  const [grupoIdentificacao, setGrupoIdentificacao] = useState(null);
  const [selectedDisciplinas, setSelectedDisciplinas] = useState(null);
  const [textDisciplinaOutra, setTextDisciplinaOutra] = useState(null);
  const [numeroAlunos, setNumeroAlunos] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisibleEscolaAgrupamento, setIsVisibleEscolaAgrupamento] =
    useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const { grupo_id } = useParams();

  const anoCurricularOptions = [
    { value: "5º Ano", label: "5º Ano" },
    { value: "6º Ano", label: "6º Ano" },
    { value: "7º Ano", label: "7º Ano" },
    { value: "8º Ano", label: "8º Ano" },
    { value: "9º Ano5", label: "9º Ano" },
  ];

  const disciplinasOptions = [
    { value: "1", label: "Cidadania e Desenvolvimento" },
    { value: "2", label: "Ciências Naturais" },
    { value: "3", label: "Educação Artística" },
    { value: "4", label: "Educação Física" },
    { value: "5", label: "Educação Moral e Religiosa Católica" },
    { value: "6", label: "Educação Musical" },
    { value: "7", label: "Educação Visual e/ou Tecnológica" },
    { value: "8", label: "Línguas estrangeiras" },
    { value: "9", label: "Física e Química" },
    { value: "10", label: "História e/ou Geografia" },
    { value: "11", label: "Matemática" },
    { value: "12", label: "Português" },
    { value: "13", label: "Tecnologias da Informação e Comunicação" },
    { value: "14", label: "Outra" },
  ];

  const [formData, setFormData] = useState({
    distrito: "",
    concelho: "",
    escola_id: "",
    escola_nome: "",
    escola_agrupamento_identificacao: "",
    ano_curricular: "",
    ano_curricular_outro: "",
    identificacao_grupo: "",
    disciplina: "",
    numero_alunos: 0,
    hide: 0,
  });

  useEffect(() => {
    const loadDistritos = async () => {

      const data = await fetchDistritos();
      setDistritos(data);
    };
    loadDistritos();
    fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/grupo/${grupo_id}`, {
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
        setSelectedDistrito(data.distrito);
        setSelectedConcelho(data.concelho);

        setFormData({
          distrito: data.distrito,
          concelho: data.concelho,
          escola_id: data.school_id,
          escola_nome: data.escola_nome,
          escola_agrupamento_identificacao: data.escola_agrupamento_identificacao,
          ano_curricular: data.ano_curricular,
          ano_curricular_outro: data.ano_curricular_outro,
          identificacao_grupo: data.identificacao_grupo,
          disciplina: data.disciplina,
          numero_alunos: data.numero_alunos,
          hide: data.hide,
        });
      })
      .catch((error) => {
        console.error("Error fetching the Grupo Escola data:", error);
      });
  }, [grupo_id]);

  useEffect(() => {
    if (selectedDistrito) {
      const loadConcelhos = async () => {
        const data = await fetchConcelhos(selectedDistrito);
        setConcelhos(data);
        if (firstLoad == false) {
          setSelectedConcelho("");
          setEscolas([]);
          setSelectedEscola("");
          formData.concelho = "";
          formData.escola_nome = "";
        } else {
          setFirstLoad(false);
        }
      };
    loadConcelhos();
  }
  }, [selectedDistrito]);

useEffect(() => {
  if (selectedConcelho) {
    const loadEscolas = async () => {
      const data = await fetchEscolas(selectedDistrito, selectedConcelho);
      const transformedOptions = data.map((item) => ({
        value: item.CODUOME,
        label: item.NOME,
        tipoAgrupamento: item.TIPOAGRUPAMENTO,
      }));
      setEscolas(transformedOptions);
      if (firstLoad == false) {
        setSelectedEscola("");
      } else {
        setFirstLoad(false);
      }
    };
    loadEscolas();
  }
}, [selectedConcelho]);

const isFormValid = () => {
  return (
    selectedDistrito == null ? formData.distrito : selectedDistrito &&
      selectedConcelho == null ? formData.concelho : selectedConcelho &&
        selectedEscola == null ? formData.escola_nome : selectedEscola &&
          selectedAnoCurricular == null ? formData.ano_curricular : selectedAnoCurricular &&
            selectedDisciplinas !=  null
      ? disciplinasOptions.find((option) => option.value === selectedDisciplinas)?.label
      : formData.disciplina.label &&
        numeroAlunos == null ? formData.numero_alunos : numeroAlunos
  );
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!isFormValid()) {
    setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  setErrorMessage("");

  const data = {
    grupo_escola_id: selectedEscolaId == null ? formData.escola_id : selectedEscolaId,
    grupo_escola_distrito: selectedDistrito == null ? formData.distrito : selectedDistrito,
    grupo_escola_concelho: selectedConcelho == null ? formData.concelho : selectedConcelho,
    grupo_escola_nome: selectedEscola == null ? formData.escola_nome : selectedEscola,
    grupo_escola_optional: escolaAgrupamentoIdentificacao == null ? formData.escola_agrupamento_identificacao : escolaAgrupamentoIdentificacao,
    ano_curricular: selectedAnoCurricular == null ? formData.ano_curricular : selectedAnoCurricular,
    ano_curricular_other: textAnoOutro == null ? formData.ano_curricular_outro : textAnoOutro,
    grupo_identificacao_grupo: grupoIdentificacao == null ? formData.identificacao_grupo : grupoIdentificacao,
    disciplina: selectedDisciplinas === "14" ? textDisciplinaOutra : selectedDisciplinas
      ? disciplinasOptions.find((option) => option.value === selectedDisciplinas)?.label
      : formData.disciplina,
    grupo_numero_alunos: numeroAlunos == null ? formData.numero_alunos : numeroAlunos,
  };


  fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/edita-grupo/${grupo_id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": window.__REACT_APP_NONCE__,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      toast.success("Grupo de jogadores editado com sucesso!");
      navigate("/grupos");
    })
    .catch((error) => {
      toast.error("Ocorreu um erro ao editar o grupo.");
      console.error("Error:", error);
    });
};

const handleBackPage = () => {
  navigate("/grupos");
};

return (
  <div className={classes.wrapperNewGroup}>
    <div className={classes.headerNewGroup}>
      <ChevronLeft className={classes.iconBack} onClick={handleBackPage} />
      <h1>EDITAR GRUPO</h1>
    </div>
    <div className={classes.containerNovoGrupo}>
      <div className={classes.formRegisterLine1}>
        <Dropdown
          id="distrito"
          label="DISTRITO"
          options={distritos.map((d) => ({ value: d, label: d }))}
          onSelect={setSelectedDistrito}
          selectedValue={selectedDistrito == null ? formData.distrito : selectedDistrito}
          isOpen={openDropdown === "distrito"}
          onToggle={(open) => setOpenDropdown(open ? "distrito" : null)}
        />
        <Dropdown
          id="concelho"
          label="CONCELHO"
          options={concelhos.map((c) => ({ value: c, label: c }))}
          onSelect={setSelectedConcelho}
          selectedValue={selectedConcelho == null ? formData.concelho : selectedConcelho}
          isOpen={openDropdown === "concelho"}
          onToggle={(open) => setOpenDropdown(open ? "concelho" : null)}
        />
      </div>
      <div className={classes.formRegisterLine2}>
        <DropdownEscolas
          id="escola"
          label="ESCOLA"
          options={escolas}
          onSelect={setSelectedEscola}
          onSelectId={setSelectedEscolaId}
          selectedValue={selectedEscola == null ? formData.escola_nome : selectedEscola}
          setIsVisibleEscolaAgrupamento={setIsVisibleEscolaAgrupamento}
          isOpen={openDropdown === "escola"}
          onToggle={(open) => setOpenDropdown(open ? "escola" : null)}
        />

        {isVisibleEscolaAgrupamento && (
          <TextInput
            id="escolaagrupamento-identificacao"
            placeholder="IDENTIFICAÇÃO ESCOLA AGRUPAMENTO (OPCIONAL)"
            value={escolaAgrupamentoIdentificacao == null ? formData.escola_agrupamento_identificacao : escolaAgrupamentoIdentificacao}
            onChange={setEscolaAgrupamentoIdentificacao}
          />
        )}
      </div>
      <div className={classes.formRegisterLine3}>
        <Dropdown
          id="ano-curricular"
          label="ANO CURRICULAR"
          options={anoCurricularOptions}
          onSelect={setSelectedAnoCurricular}
          selectedValue={selectedAnoCurricular == null ? formData.ano_curricular : selectedAnoCurricular}
          isOpen={openDropdown === "ano-curricular"}
          onToggle={(open) => setOpenDropdown(open ? "ano-curricular" : null)}
        />
        <TextInput
          id="outro-ano-escolar"
          label="OUTRO (OPCIONAL)"
          placeholder="OUTRO (OPCIONAL)"
          value={textAnoOutro == null ? formData.ano_curricular_outro : textAnoOutro}
          onChange={setTextAnoOutro}
        />
      </div>
      <div className={classes.formRegisterLine4}>
        <TextInput
          id="grupo-identificacao"
          label="IDENT. DE GRUPO (OPCIONAL)"
          placeholder="IDENTIF. DE GRUPO (OPCIONAL)"
          value={grupoIdentificacao == null ? formData.identificacao_grupo : grupoIdentificacao}
          onChange={setGrupoIdentificacao}
        />
      </div>
      <div className={classes.formRegisterLine5}>
        <Dropdown
          id="disciplinas"
          label="DISCIPLINAS"
          options={disciplinasOptions}
          onSelect={setSelectedDisciplinas}
          selectedValue={selectedDisciplinas != null
            ? disciplinasOptions.find((option) => option.value === selectedDisciplinas)?.label
            : formData.disciplina
          }
          isOpen={openDropdown === "disciplinas"}
          onToggle={(open) => setOpenDropdown(open ? "disciplinas" : null)}
        />
        {selectedDisciplinas === "14" && (
          <TextInput
            id="outra-disciplina"
            label="OUTRA DISCIPLINA"
            placeholder="Insira a disciplina"
            value={ textDisciplinaOutra == null ? formData.outra : textDisciplinaOutra}
            onChange={setTextDisciplinaOutra}
          />
        )}
      </div>
      <div className={classes.formRegisterLine6}>
        <NumberInput
          id="numero-alunos"
          label="Número de alunos:"
          placeholder="Número de alunos (OBRIGATÓRIO)"
          value={numeroAlunos == null ? formData.numero_alunos : numeroAlunos}
          onChange={setNumeroAlunos}
          min={0}
        />
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <button
        id="submit-grupo"
        className={classes.groupSubmitButton}
        onClick={handleSubmit}
      >
        EDITAR GRUPO
      </button>
    </div>
  </div>
);
};

export default EditaGrupos;
