import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import classes from "./novo-grupo.module.css";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    `${process.env.REACT_APP_API_URL}/rayuela/v1/distritos-protocolo`,{
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
    `${
      process.env.REACT_APP_API_URL
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
    `${
      process.env.REACT_APP_API_URL
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
const NovoGrupo = () => {
  const [distritos, setDistritos] = useState([]);
  const [concelhos, setConcelhos] = useState([]);
  const [escolas, setEscolas] = useState([]);

  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [selectedConcelho, setSelectedConcelho] = useState("");
  const [selectedEscola, setSelectedEscola] = useState("");
  const [selectedEscolaId, setSelectedEscolaId] = useState("");
  const [escolaAgrupamentoIdentificacao, setEscolaAgrupamentoIdentificacao] =
    useState("");
  const [selectedAnoCurricular, setSelectedAnoCurricular] = useState("");
  const [textAnoOutro, setTextAnoOutro] = useState("");
  const [grupoIdentificacao, setGrupoIdentificacao] = useState("");
  const [selectedDisciplinas, setSelectedDisciplinas] = useState("");
  const [textDisciplinaOutra, setTextDisciplinaOutra] = useState("");
  const [numeroAlunos, setNumeroAlunos] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisibleEscolaAgrupamento, setIsVisibleEscolaAgrupamento] =
    useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const anoCurricularOptions = [
    { value: "5º Ano", label: "5º Ano" },
    { value: "6º Ano", label: "6º Ano" },
    { value: "7º Ano", label: "7º Ano" },
    { value: "8º Ano", label: "8º Ano" },
    { value: "9º Ano", label: "9º Ano" },
  ];

  const disciplinasOptions = [
    { value: "0", label: "Cidadania e Desenvolvimento" },
    { value: "1", label: "Ciências Naturais" },
    { value: "2", label: "Educação Artística" },
    { value: "3", label: "Educação Física" },
    { value: "4", label: "Educação Moral e Religiosa Católica" },
    { value: "5", label: "Educação Musical" },
    { value: "6", label: "Educação Visual e/ou Tecnológica" },
    { value: "7", label: "Línguas estrangeiras" },
    { value: "8", label: "Física e Química" },
    { value: "9", label: "História e/ou Geografia" },
    { value: "10", label: "Matemática" },
    { value: "11", label: "Português" },
    { value: "12", label: "Tecnologias da Informação e Comunicação" },
    { value: "13", label: "Outra" },
  ];

  useEffect(() => {
    const loadDistritos = async () => {
      const data = await fetchDistritos();
      setDistritos(data);
    };
    loadDistritos();
  }, []);

  useEffect(() => {
    if (selectedDistrito) {
      const loadConcelhos = async () => {
        const data = await fetchConcelhos(selectedDistrito);
        setConcelhos(data);
        setSelectedConcelho("");
        setEscolas([]);
        setSelectedEscola("");
      };
      loadConcelhos();
    }
  }, [selectedDistrito]);

  useEffect(() => {
    if (selectedConcelho) {
      const loadEscolas = async () => {
        const data = await fetchEscolas(selectedDistrito, selectedConcelho);
        const transformedOptions = data.map((item) => ({
          value: item.ESCOLAID,
          label: item.NOME.replace(/[\u0092]/g, "'"),
          tipoAgrupamento: item.TIPOAGRUPAMENTO,
        }));
        setEscolas(transformedOptions);
        setSelectedEscola("");
      };
      loadEscolas();
    }
  }, [selectedConcelho]);

  const isFormValid = () => {
    return (
      selectedDistrito &&
      selectedConcelho &&
      selectedEscola &&
      selectedAnoCurricular &&
      selectedDisciplinas &&
      numeroAlunos
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
      grupo_escola_id: selectedEscolaId,
      grupo_escola_distrito: selectedDistrito,
      grupo_escola_concelho: selectedConcelho,
      grupo_escola_nome: selectedEscola,
      grupo_escola_optional: escolaAgrupamentoIdentificacao,
      ano_curricular: selectedAnoCurricular,
      ano_curricular_other: textAnoOutro,
      grupo_identificacao_grupo: grupoIdentificacao,
      disciplina:
        selectedDisciplinas === "13"
          ? textDisciplinaOutra
          : disciplinasOptions[selectedDisciplinas].label,
      grupo_numero_alunos: numeroAlunos,
    };

    fetch(`${process.env.REACT_APP_API_URL}/perfilb/v1/grava-grupo`, {
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
        toast.success("Grupo de jogadores criado com sucesso!");
        setTimeout(() => {
          navigate("/grupos");
        }, 3100);
      })
      .catch((error) => {
        toast.error("Ocorreu um erro. Tente novamente dentro de alguns momentos.");
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
        <h1>NOVO GRUPO</h1>
      </div>
      <div className={classes.containerNovoGrupo}>
        <div className={classes.formRegisterLine1}>
          <Dropdown
            id="distrito"
            label="DISTRITO"
            options={distritos.map((d) => ({ value: d, label: d }))}
            onSelect={setSelectedDistrito}
            selectedValue={selectedDistrito}
            isOpen={openDropdown === "distrito"}
            onToggle={(open) => setOpenDropdown(open ? "distrito" : null)}
          />
          <Dropdown
            id="concelho"
            label="CONCELHO"
            options={concelhos.map((c) => ({ value: c, label: c }))}
            onSelect={setSelectedConcelho}
            selectedValue={selectedConcelho}
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
            selectedValue={selectedEscola}
            setIsVisibleEscolaAgrupamento={setIsVisibleEscolaAgrupamento}
            isOpen={openDropdown === "escola"}
            onToggle={(open) => setOpenDropdown(open ? "escola" : null)}
          />

          {isVisibleEscolaAgrupamento && (
            <TextInput
              id="escolaagrupamento-identificacao"
              placeholder="IDENTIFICAÇÃO ESCOLA AGRUPAMENTO (OPCIONAL)"
              value={escolaAgrupamentoIdentificacao}
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
            selectedValue={selectedAnoCurricular}
            isOpen={openDropdown === "ano-curricular"}
            onToggle={(open) => setOpenDropdown(open ? "ano-curricular" : null)}
          />
          <TextInput
            id="outro-ano-escolar"
            label="OUTRO (OPCIONAL)"
            placeholder="OUTRO (OPCIONAL)"
            value={textAnoOutro}
            onChange={setTextAnoOutro}
          />
        </div>
        <div className={classes.formRegisterLine4}>
          <TextInput
            id="grupo-identificacao"
            label="IDENT. DE GRUPO (OPCIONAL)"
            placeholder="IDENTIF. DE GRUPO (OPCIONAL)"
            value={grupoIdentificacao}
            onChange={setGrupoIdentificacao}
          />
        </div>
        <div className={classes.formRegisterLine5}>
          <Dropdown
            id="disciplinas"
            label="DISCIPLINAS"
            options={disciplinasOptions}
            onSelect={setSelectedDisciplinas}
            selectedValue={
              disciplinasOptions.find(
                (option) => option.value === selectedDisciplinas
              )?.label
            }
            isOpen={openDropdown === "disciplinas"}
            onToggle={(open) => setOpenDropdown(open ? "disciplinas" : null)}
          />
          {selectedDisciplinas === "14" && (
            <TextInput
              id="outra-disciplina"
              label="OUTRA DISCIPLINA"
              placeholder="Insira a disciplina"
              value={textDisciplinaOutra}
              onChange={setTextDisciplinaOutra}
            />
          )}
        </div>
        <div className={classes.formRegisterLine6}>
          <NumberInput
            id="numero-alunos"
            label="Número de alunos:"
            placeholder="Número de alunos (OBRIGATÓRIO)"
            value={numeroAlunos}
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
          REGISTAR GRUPO
        </button>
      </div>
    </div>
  );
};

export default NovoGrupo;
