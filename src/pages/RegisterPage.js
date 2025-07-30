import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import axios from "axios";

// 회원가입 API 호출 함수
async function register({ email, name, password }) {
  const response = await axios.post("/api/user/join", {
    email,
    name,
    password,
  });
  return response;
}

// 이메일 중복 확인 API 호출 함수
async function checkEmail({ email }) {
  const response = await axios.post("/api/user/check-email", { email });
  return response;
}

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [error, setError] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [debounceTimer, setDebounceTimer] = useState(null);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const checkEmailDuplication = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      try {
        if (!email.trim()) {
          toast.warn("이메일을 입력하세요.");
          return;
        }
        if (!email.includes("@")) {
          toast.warn("유효한 이메일 형식이 아닙니다.");
          return;
        }

        setIsCheckingEmail(true);

        const res = await axios.post("/api/user/check-email", { email });
        if (res.data.exists) {
          toast.error("이미 등록된 이메일입니다.");
          setIsEmailChecked(false);
        } else {
          toast.success("사용 가능한 이메일입니다.");
          setIsEmailChecked(true);
        }
      } catch (err) {
        toast.error("이메일 확인 중 오류가 발생했습니다.");
        setIsEmailChecked(false);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 300);
    setDebounceTimer(timer);
  }, [email]);

  const handleRegister = async () => {
    if (isSubmitting) {
      return;
    }

    if (!name.trim() || !email || !password || !confirmPassword) {
      toast.warn("모든 항목을 입력해주세요.");
      return;
    }

    if (!email.includes("@")) {
      toast.warn("유효한 이메일 형식이 아닙니다.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
      return;
    } else {
      setConfirmError("");
    }

    if (!isEmailChecked) {
      toast.warn("이메일 중복 확인을 먼저 해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await register({
        email,
        name: name.trim(),
        password,
      });

      toast.success("회원가입 성공!", {
        onClose: () => navigate("/login"),
        autoClose: 1500,
      });
    } catch (err) {
      setError(err.message);
      toast.error("회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <ToastContainer />
      <div className="app-header">
        <h1 className="app-title">회원가입</h1>
      </div>

      <div className="app-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="icon">
                <img src="/icon_account.svg" alt="계정" />
              </span>
              새 계정 만들기
            </h2>
          </div>
          <div className="card-content">
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">이름</label>
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="todo-input"
                disabled={isSubmitting}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">이메일</label>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => {
                    const lowercaseEmail = e.target.value.toLowerCase();
                    setEmail(lowercaseEmail);
                    setIsEmailChecked(false);
                  }}
                  className="todo-input"
                  disabled={isSubmitting}
                />
                <button
                  onClick={checkEmailDuplication}
                  disabled={isCheckingEmail || !email.trim() || isSubmitting}
                  className="add-button"
                  style={{
                    minWidth: "100px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    opacity:
                      isCheckingEmail || !email.trim() || isSubmitting
                        ? 0.6
                        : 1,
                    cursor:
                      isCheckingEmail || !email.trim() || isSubmitting
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isCheckingEmail ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          border: "2px solid white",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      확인중
                    </div>
                  ) : (
                    "중복 확인"
                  )}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="todo-input"
                disabled={isSubmitting}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">비밀번호 확인</label>
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value !== password) {
                    setConfirmError("비밀번호가 일치하지 않습니다.");
                  } else {
                    setConfirmError("");
                  }
                }}
                className="todo-input"
                disabled={isSubmitting}
              />
              {confirmError && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {confirmError}
                </p>
              )}
            </div>

            {error && <div className="error-box">{error}</div>}

            <button
              onClick={handleRegister}
              disabled={isSubmitting}
              className="add-button"
              style={{
                width: "100%",
                fontSize: "1rem",
                fontWeight: "500",
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
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
                  회원가입 진행 중...
                </div>
              ) : (
                "회원가입"
              )}
            </button>
          </div>
        </div>

        {/* 로그인 링크 */}
        <div className="card">
          <div className="card-content">
            <div
              style={{
                textAlign: "center",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              이미 계정이 있으신가요?{" "}
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                로그인 하기
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

export default RegisterPage;
