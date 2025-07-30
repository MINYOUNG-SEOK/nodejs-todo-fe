import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TodoBoard from "../components/TodoBoard";
import api from "../utils/api";

function TodoPage({ setUser }) {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    api.defaults.headers["authorization"] = "";
    setUser(null);
    navigate("/login", { replace: true });
  };

  const getTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTodoList(response.data.data);
    } catch (err) {
      console.error("할일 목록 조회 실패", err);
    }
  };

  const addTask = async () => {
    try {
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
      });
      if (response.status === 200) {
        setTodoValue("");
        await getTasks();
      } else {
        throw new Error("Task can not be added");
      }
    } catch (err) {
      console.error("할일 추가 실패", err);
      // 에러 발생 시에도 기존 목록은 유지
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      await getTasks();
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  const completeTask = async (id, currentStatus) => {
    try {
      await api.put(`/tasks/${id}`, { isComplete: !currentStatus });
      await getTasks();
    } catch (err) {
      console.error("완료 처리 실패", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const completedCount = todoList.filter((t) => t.isComplete).length;
  const totalCount = todoList.length;

  const filteredTodos = todoList.filter((todo) => {
    if (filter === "active") return !todo.isComplete;
    if (filter === "completed") return todo.isComplete;
    return true;
  });

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">할일 관리</h1>
      </div>
      <div className="logout-box">
        <button onClick={handleLogout} className="logout-button">
          로그아웃
        </button>
      </div>

      <div className="app-content">
        {/* 할일 추가 */}
        <div className="add-todo-section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="icon">➕</span>새 할일 추가
              </h2>
            </div>
            <div className="card-content">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="할일을 입력하세요"
                  className="todo-input"
                  value={todoValue}
                  onChange={(e) => setTodoValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  className="add-button"
                  onClick={addTask}
                  disabled={isLoading || !todoValue.trim()}
                >
                  {isLoading ? "추가 중..." : "추가"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="stats-section">
          <div className="card">
            <div className="card-content">
              <div className="stats-row">
                <span>전체: {totalCount}개</span>
                <span>완료: {completedCount}개</span>
                <span>남은 할일: {totalCount - completedCount}개</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width:
                      totalCount > 0
                        ? `${(completedCount / totalCount) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="filter-section">
          <div className="card">
            <div className="card-content">
              <div className="filter-tabs">
                <button
                  onClick={() => setFilter("all")}
                  className={`filter-tab ${filter === "all" ? "active" : ""}`}
                >
                  전체 ({totalCount})
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={`filter-tab ${
                    filter === "active" ? "active" : ""
                  }`}
                >
                  진행중 ({totalCount - completedCount})
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`filter-tab ${
                    filter === "completed" ? "active" : ""
                  }`}
                >
                  완료됨 ({completedCount})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 목록 */}
        <TodoBoard
          todoList={filteredTodos}
          onDelete={deleteTask}
          onComplete={completeTask}
          filter={filter}
        />
      </div>
    </div>
  );
}

export default TodoPage;
