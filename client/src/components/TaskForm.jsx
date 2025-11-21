import { useState } from "react";

function TaskForm({ onCreateTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      description: description.trim() || undefined,
      deadline: deadline ? new Date(deadline) : undefined,
    });

    setTitle("");
    setDescription("");
    setDeadline("");
  }

  return (
    <div className="card">
      <h3>Create Task</h3>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-row">
          <label>
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            value={title}
            placeholder="e.g. Finish statics homework"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea
            rows={3}
            value={description}
            placeholder="Optional details…"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">
          Add Task
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
