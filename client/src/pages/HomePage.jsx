import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";

function HomePage({
  tasks,
  loading,
  error,
  onRefresh,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) {
  return (
    <section>
      <h2>Planner</h2>
      <p className="section-subtitle">
        Add tasks, set deadlines, and track your progress.
      </p>

      <TaskForm onCreateTask={onCreateTask} />

      {error && <p className="error">{error}</p>}

      <div className="card card-header-row">
        <div className="card-header-text">Tasks</div>
        <button className="btn-secondary" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet. Create your first one above.</p>
      ) : (
        <TaskList
          tasks={tasks}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      )}
    </section>
  );
}

export default HomePage;
