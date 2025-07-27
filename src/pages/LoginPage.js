import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";
import "../App.css";

async function login({ email, password }) {
  const response = await axios.post("/api/user/login", { email, password });
  return response;
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/todo");
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (isSubmitting) {
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await login({ email: email.toLowerCase(), password });
      console.log(response);
      if (response.status === 200) {
        setUser(response.user);
        sessionStorage.setItem("token", response.data.token);
        api.defaults.headers["authorization"] = "Bearer " + response.data.token;
        setError("");
        navigate("/todo");
      }
    } catch (err) {
      console.error("로그인 실패:", err);

      if (err.response) {
        const statusCode = err.response.status;
        const errorMessageFromServer = err.response.data.message;

        if (statusCode === 400) {
          setError(
            errorMessageFromServer ||
              "이메일 또는 비밀번호가 올바르지 않습니다."
          );
        } else if (statusCode === 401) {
          setError(
            errorMessageFromServer ||
              "이메일 또는 비밀번호가 일치하지 않습니다."
          );
        } else if (statusCode === 404) {
          setError("로그인 서버에 연결할 수 없습니다. 관리자에게 문의하세요.");
        } else {
          setError(`로그인 요청 중 오류가 발생했습니다: ${statusCode}`);
        }
      } else if (err.request) {
        setError("서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
      } else {
        setError("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">로그인</h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "1rem",
            marginTop: "0.5rem",
            textAlign: "center",
          }}
        >
          계정에 로그인하여 계속하세요
        </p>
      </div>

      <div className="app-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="icon">
                <img src="/icon_login.svg" alt="계정" />
              </span>
              로그인
            </h2>
          </div>
          <div className="card-content">
            {/* 이메일 입력 */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.875rem",
                }}
              >
                이메일
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                onKeyPress={handleKeyPress}
                className="todo-input"
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.875rem",
                }}
              >
                비밀번호
              </label>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="todo-input"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  marginBottom: "1rem",
                  color: "#dc2626",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {error}
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              onClick={handleLogin}
              disabled={isSubmitting || !email.trim() || !password.trim()}
              className="add-button"
              style={{
                width: "100%",
                fontSize: "1rem",
                fontWeight: "500",
                opacity:
                  isSubmitting || !email.trim() || !password.trim() ? 0.6 : 1,
                cursor:
                  isSubmitting || !email.trim() || !password.trim()
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isSubmitting ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid white",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  로그인 중...
                </div>
              ) : (
                "로그인"
              )}
            </button>
          </div>
        </div>

        {/* 회원가입 링크 */}
        <div className="card">
          <div className="card-content">
            <div
              style={{
                textAlign: "center",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              아직 계정이 없으신가요?{" "}
              <button
                onClick={() => navigate("/register")}
                disabled={isSubmitting}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  textDecoration: "underline",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                회원가입 하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 스피너 애니메이션을 위한 CSS */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default LoginPage;
