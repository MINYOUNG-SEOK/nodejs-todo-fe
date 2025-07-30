import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodoPage from "./pages/TodoPage";
import PrivateRoute from "./route/PrivateRoute";
import api from "./utils/api";

function App() {
  const [user, setUser] = useState(null);
  const getUser = async () => {
    try {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        const response = await api.get("/user/me");
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // 토큰이 만료되었거나 유효하지 않은 경우 토큰 제거
      sessionStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute user={user}>
              <TodoPage setUser={setUser} />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={<LoginPage user={user} setUser={setUser} />}
        />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
