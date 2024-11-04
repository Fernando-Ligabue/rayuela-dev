import React, { useState } from "react";

import classes from "./documentacao.module.css";
import { documentLinks as docs, GUIAPDF } from "../../utils/constants";

const Documentacao = () => {
  const [viewDoc, setViewDoc] = useState(null);

  return (
    <div className={classes.wrapperDownloadContainer}>
      <h1>Documentos Importantes</h1>
      <div className={classes.contentDownload}>
        <p>
          A identidade da história do projeto RAYUELA foi criada de acordo com a
          missão básica do projeto, capacitar e educar os jovens (crianças e
          adolescentes principalmente) sobre os benefícios, riscos e ameaças
          intrinsecamente ligados ao uso da Internet por meio de brincadeiras,
          prevenindo e mitigando assim o comportamento cibercriminoso. Nossas
          ideias sustentam uma crença comum de que a Internet se tornou parte
          integrante da vida de crianças e jovens. O aumento do tempo gasto
          online está gerando perguntas sobre se eles estão no controle do uso
          da Internet. O principal objetivo do RAYUELA é entender melhor os
          motivadores e fatores humanos que afetam certas formas relevantes de
          criminalidade cibernética, bem como capacitar e educar os jovens
        </p>
      </div>
      <div className={classes.wrapperButtons}>
        <div className={classes.titleDownload}>
          <h3>DOCUMENTOS DISPONÍVEIS</h3>
        </div>
        <div className={classes.wrapperSingleButtons}>
          {docs.map((doc) => (
            <button key={doc.id} onClick={() => setViewDoc(doc.link)}>{doc.name}</button>
          ))}
        </div>
        <div>
        <iframe src={viewDoc} className={classes.iframe} title="DOCUMENTAÇÃO RAYUELA"/>
        </div>
      </div>
    </div>
  );
};

export default Documentacao;
