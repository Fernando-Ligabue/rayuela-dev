import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar/Sidebar";
import ListaGrupos from "./pages/grupos/ListaGrupos/ListaGrupos";
import DownloadJogo from "./pages/Download/DownloadJogo";
import FeedbackPage from "./pages/FeedbackPage/FeedbackPage";
import Contacto from "./pages/Contacto/Contacto";
import NovoGrupo from "./pages/grupos/NovoGrupo/NovoGrupo";
import NovaSessao from "./pages/grupos/NovaSessao/NovaSessao";
import Sessoes from "./pages/grupos/Sessoes/Sessoes";

import classes from "./App.module.css";
import HamburgerMenu from "./components/HamburgerMenu/HamburgerMenu";
// import FeedbackIcon from "./components/Feedback/Feedback";
import EditaGrupos from "./pages/grupos/EditaGrupos/EditaGrupos";
import EditaSessoes from "./pages/grupos/EditaSessoes/EditaSessoes";
import Documentacao from "./pages/Documentos/Documentacao";

const App = () => {
  // const basename = "/rayuela-testes/professores/rayuela-professores"; //  Set the base path where your React app is hosted
  // const basename = "/"; //  Set the base path where your React app is hosted

  const basename = window.__REACT_APP_BASENAME__;
  return (
    <Router basename={basename}>
      <AppRoutes />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};

const AppRoutes = () => {
  const initialRoute = window.__REACT_APP_ROUTE__ || "grupos"; // Get the initial route from the global variable
  const navigate = useNavigate();

  useEffect(() => {
    if (window.__REACT_APP_EXTERNAL_NAVIGATION__) {
      window.__REACT_APP_EXTERNAL_NAVIGATION__ = false;
      if (initialRoute) {
        navigate(`/${initialRoute}`);
      }
    }
  }, [initialRoute, navigate]);

  return (
    <div className={classes.appContainer}>
      <div className={classes.appContent}>
        <HamburgerMenu />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to={`/${initialRoute}`} />} />
          <Route path="/grupos" element={<ListaGrupos />} />
          <Route path="/novo-grupo" element={<NovoGrupo />} />
          <Route path="/editar-grupo/:grupo_id" element={<EditaGrupos />} />
          <Route path="/nova-sessao/:grupo_id" element={<NovaSessao />} />
          <Route path="/sessoes/:grupo_id" element={<Sessoes />} />
          <Route path="/edita-sessao/:sessao_id" element={<EditaSessoes />} />
          <Route path="/download" element={<DownloadJogo />} />
          <Route path="/download-docs" element={<Documentacao />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/contato" element={<Contacto />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
