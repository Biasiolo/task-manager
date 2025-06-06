import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./features/auth/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";


function App() {
  const { session, isLoading } = useAuth();

  if (isLoading) return <div>Carregando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;