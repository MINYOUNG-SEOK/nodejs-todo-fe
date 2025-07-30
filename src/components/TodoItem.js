const TodoItem = ({ item, onDelete, onComplete, currentUser }) => {
  const isAuthor =
    currentUser &&
    item.author &&
    (currentUser._id === item.author._id || currentUser._id === item.author);

  const handleDeleteClick = () => {
    if (isAuthor) {
      const isConfirmed = window.confirm("정말로 이 할일을 삭제하시겠습니까?");
      if (isConfirmed) {
        onDelete(item._id);
      }
    } else {
      alert("다른 사람이 작성한 할일은 삭제할 수 없습니다.");
    }
  };

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
        <div className="todo-meta">
          {item.author && item.author.name && (
            <p className="todo-author">작성자: {item.author.name}</p>
          )}
          {item.author && item.author.name && item.createdAt && (
            <span className="todo-separator">|</span>
          )}
          {item.createdAt && (
            <p className="todo-date">
              {new Date(item.createdAt).toLocaleString("ko-KR")}
            </p>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          onClick={handleDeleteClick}
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
