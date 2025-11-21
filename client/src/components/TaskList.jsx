function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  return (
    <ul className="task-list card">
      {tasks.map((task) => (
        <li key={task._id} className="task-item">
          <div className="task-main">
            <h3>{task.title}</h3>
            {task.description && (
              <p className="task-desc">{task.description}</p>
            )}
          </div>

          <div className="task-meta">
            {task.deadline && (
              <p>
                Due:{" "}
                {new Date(task.deadline).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
            <p>
              Status:{" "}
              <span className={task.completed ? "tag-done" : "tag-open"}>
                {task.completed ? "Completed" : "Open"}
              </span>
            </p>
          </div>

          <div className="task-actions">
            <button
              className="btn-secondary"
              onClick={() =>
                onUpdateTask(task._id, { completed: !task.completed })
              }
            >
              {task.completed ? "Reopen" : "Mark Complete"}
            </button>
            <button
              className="btn-danger"
              onClick={() => onDeleteTask(task._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
