import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Comment from "./components/Comments";
import EditExam from "./components/EditExam";
import MisExamenes from "./components/MisExamenes";
import StudentExams from "./components/StudentExams";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserContext, UserProvider } from "./components/UserContext";
import CalificacionesAlumno from "./pages/CalificacionesAlumno";
import Configuracion from "./pages/Configuracion";
import Descargar from "./pages/Descargar";
import Examen from "./pages/Examen";
import Grupo from "./pages/Grupo";
import Home from "./pages/Home";
import Juego from "./pages/Juego";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import MisGrupos from "./pages/MisGrupos";
import Student from "./pages/MisGruposStudent";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Usuario from "./pages/Usuario";
import ProfileCard from "./components/ProfileCard";


/**
 * This is a React functional component that sets up routes for different pages and handles user
 * authentication using local storage.
 * @returns The App component is being returned, which contains a BrowserRouter component with several
 * Route components that render different components based on the current URL path. The component
 * rendered for each path includes props such as user, isLoggedIn, onLogin, onLogout, and isAllowed,
 * which are used to manage user authentication and authorization.
 */

function App() {
  const { user, isLoggedIn, onLogout } = useContext(UserContext) || {};

  console.log("usersiuuuuuu en appjs", user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/examenes"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.user_role.includes("Profesor")}
              redirectTo="/"
            >
              <Examen />
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/juego"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.user_role.includes("Profesor")}
              redirectTo="/login"
            >
              <Juego />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grupos"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.user_role.includes("Profesor")}
              redirectTo="/login"
            >
              <Grupo />
            </ProtectedRoute>
          }
        />

        <Route path="/misgrupos" element={<MisGrupos />} />

        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/calificacionesAlumno"
          element={<CalificacionesAlumno />}
        />

        <Route
          path="/comentarios"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.user_role.includes("Profesor")}
              redirectTo="/"
            >
              <Comment />
            </ProtectedRoute>
          }
        />

        {/* //Rutas recien agregadas */}
        <Route path="/misexamenes" element={<MisExamenes />} />

        <Route
          path="/editarexamenes"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.user_role.includes("Profesor")}
              redirectTo="/"
            >
              <EditExam />
            </ProtectedRoute>
          }
        />

        <Route path= "ExamenesEstudiantePorGrupo" element={<StudentExams />} />


        <Route
          path="/configuracion"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.user_role.includes("Profesor")}
              redirectTo="/"
            >
              <Configuracion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/descargar"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.user_role.includes("Profesor")}
              redirectTo="/"
            >
              <Descargar />
            </ProtectedRoute>
          }
        />

        <Route path="/avance" element={<Student />} />

        <Route
          path="/usuario"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.user_role.includes("Profesor")}
              redirectTo="/"
            >
              <ProfileCard />
            </ProtectedRoute>
          }
        />

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
