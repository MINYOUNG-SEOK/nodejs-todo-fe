const TodoItem = ({ item, onDelete, onComplete }) => {
  return (
    <div className={`todo-item ${item.isComplete ? "completed" : ""}`}>
      <div className="todo-checkbox-container">
        <input
          type="checkbox"
          id={`todo-${item._id}`}
          checked={item.isComplete}
          onChange={() => onComplete(item._id, item.isComplete)}
          className="todo-checkbox"
        />
        <label htmlFor={`todo-${item._id}`} className="checkbox-label"></label>
      </div>

      <div className="todo-content">
        <label
          htmlFor={`todo-${item._id}`}
          className={`todo-text ${item.isComplete ? "completed-text" : ""}`}
        >
          {item.task}
        </label>
        {item.createdAt && (
          <p className="todo-date">
            {new Date(item.createdAt).toLocaleString("ko-KR")}
          </p>
        )}
      </div>

      <div className="todo-actions">
        <button
          onClick={() => onDelete(item._id)}
          className="action-button delete-button"
          title="삭제"
        >
          <img src="/icon_trash.svg" alt="삭제" width="18" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
