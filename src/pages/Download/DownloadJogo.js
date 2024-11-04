import React from "react";

import {DOWNLOAD_GAME} from "../../utils/constants"
import classes from "./download.module.css";

const DownloadJogo = () => {
  return (
    <div className={classes.wrapperDownloadContainer}>
      <h1>App Rayuela</h1>
      <div className={classes.contentDownload}>
        <img
          src={DOWNLOAD_GAME}
          alt="Rayuela APP"
        />
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
          <h3>DOWNLOAD</h3>
        </div>
        <div className={classes.wrapperSingleButtons}>
          <a href="https://rayuela.pj.pt/wp-content/uploads-private/RAYUELAzip" download noreferrer rel="noreferrer">COMPUTADOR</a>
          <a href="https://rayuela.pj.pt/wp-content/uploads-private/RAYUELA.apk" download noreferrer rel="noreferrer">SMARTPHONE</a>
        </div>
      </div>
    </div>
  );
};

export default DownloadJogo;
