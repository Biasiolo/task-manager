import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./features/auth/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";


function App() {
  const { session, isLoading } = useAuth();

  if (isLoading) return <div>Carregando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={session ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard/*"
          element={session ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;