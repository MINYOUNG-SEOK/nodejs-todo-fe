import TodoItem from "./TodoItem";

const TodoBoard = ({ todoList, onDelete, onComplete, filter, currentUser }) => {
  return (
    <div className="todo-board-section">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="icon">
              <img src="/icon_calendar.svg" alt="달력" width="22" height="22" />
            </span>
            할일 목록
          </h2>
        </div>
        <div className="card-content">
          {todoList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <img
                  src="/icon_calendar.svg"
                  alt="달력"
                  width="50"
                  height="50"
                />
              </div>
              <div className="empty-text">
                {filter === "all" && <p>아직 할일이 없습니다.</p>}
                {filter === "active" && <p>진행중인 할일이 없습니다.</p>}
                {filter === "completed" && <p>완료된 할일이 없습니다.</p>}
                <p className="empty-subtext">위에서 새 할일을 추가해보세요!</p>
              </div>
            </div>
          ) : (
            <div className="todo-list">
              {todoList.map((item) => (
                <TodoItem
                  key={item._id}
                  item={item}
                  onDelete={onDelete}
                  onComplete={onComplete}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoBoard;
