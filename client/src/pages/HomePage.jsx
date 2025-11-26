import { useState, useMemo } from "react";

function HomePage({
  tasks,
  loading,
  error,
  onRefresh,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");

  // Calculate stats from tasks
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get start of current week (Sunday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const completedThisWeek = tasks.filter((task) => {
      if (!task.completed) return false;
      const completedDate = new Date(task.updatedAt || task.createdAt);
      return completedDate >= weekStart;
    }).length;

    // Simple streak calculation (consecutive days with completed tasks)
    let streak = 0;
    let checkDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const hasCompletedTask = tasks.some((task) => {
        if (!task.completed) return false;
        const completedDate = new Date(task.updatedAt || task.createdAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === checkDate.getTime();
      });
      
      if (hasCompletedTask) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // Check yesterday if no tasks today
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { completedThisWeek, streak };
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onCreateTask({
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      deadline: newTaskDeadline ? new Date(newTaskDeadline) : undefined,
      completed: false,
    });

    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDeadline("");
    setIsModalOpen(false);
  };

  const petHappiness = Math.min(100, stats.streak * 10 + stats.completedThisWeek * 20);

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-text-light hover:text-text-dark text-2xl"
            >
              ×
            </button>
            
            <h3 className="text-2xl font-bold text-dark mb-6">Create Task</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Title <span className="text-dar">*</span>
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  placeholder="e.g. Finish statics homework"
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary-light rounded-lg focus:outline-none focus:border-primary bg-bg text-text-dark"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newTaskDescription}
                  placeholder="Optional details…"
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary-light rounded-lg focus:outline-none focus:border-primary resize-none bg-bg text-text-dark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="required w-full px-4 py-3 border-2 border-primary-light rounded-lg focus:outline-none focus:border-primary bg-bg text-text-dark"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-text-light text-text-dark rounded-lg font-semibold hover:bg-bg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-bg pt-6 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Floating Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-[0_6px_0_#5a86c4] transition-all hover:scale-110 hover:bg-primary-dark flex items-center justify-center z-40 active:translate-y-0.5"
          >
            <span className="text-4xl font-light leading-none">+</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-dark mb-2">Task Buddy</h1>
            <p className="text-text-light">Complete tasks to keep your pet happy!</p>
          </div>

          {/* Progress Days */}
          {/* LINK WITH BACKEND TO TRACK USERS CURRENT COMPLETED TASKS BY DAY. DAYS SHOULD SHOW EACH DAYS OWN TASK, AND LIGHT UP GREEN IF COMPLETED, RED IF NOT, YELLOW IF TO-DO IN*/}
          <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6 mb-6">
            <h2 className="text-xl font-semibold text-text-dark mb-4">Weekly Progress</h2>
            <div className="flex justify-around items-center">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={`flex flex-col items-center justify-center m-0.5 w-40 h-30 rounded-2xl shadow-[0_3px_2px_#c9c5bf] ${
                    day <= Math.ceil(stats.completedThisWeek / 2)
                      ? "bg-accent text-white"
                      : "bg-bg text-text-light"
                  }`}
                >
                  <span className="text-lg">Day</span>
                  <span className="text-3xl font-bold">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Tasks Completed This Week */}
            <div className="bg-bg-card rounded-2xl p-6 shadow-[0_6px_3px_#c9c5bf]">
              <h3 className="text-lg font-semibold text-text-dark mb-4">
                Tasks Completed
              </h3>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-2 block">✅</span>
                  <div className="text-green-300 text-5xl font-bold  mb-2">
                    {stats.completedThisWeek}
                  </div>
                  <div className="text-text-light">This Week</div>
                </div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6">
              <h3 className="text-lg font-semibold text-text-dark mb-4">
                Current Streak
              </h3>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-2 block">🔥</span>
                  <div className="text-5xl font-bold text-orange-400">
                    {stats.streak}
                  </div>
                  <div className="text-text-light">Days</div>
                </div>
              </div>
            </div>

            {/* Pet Happiness */}
            <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6">
              {/* Header with title and percentage */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-dark">
                  Pet Happiness
                </h3>
                <div className="text-lg font-semibold text-text-dark">
                  {petHappiness}%
                </div>
              </div>
              
              {/* Happiness Bar */}
              <div className="mb-4">
                <div className="w-full bg-bg rounded-full h-4 shadow-[0_3px_1px_#c9c5bf]">
                  <div
                    className="bg-accent h-4 rounded-full transition-all duration-500"
                    style={{ width: `${petHappiness}%` }}
                  />
                </div>
              </div>

              {/* Pet Display Box */}
              {/* LINK USERS CURRENT EQUIPPED PET HERE. WILL USE IDLE ANIMATION (2-3 IMAGES REPEATED*/}
              <div className="bg-bg rounded-2xl p-8 flex items-center justify-center shadow-[0_3px_3px_#c9c5bf]">
                <span className="text-7xl">🐱TEMP</span>
              </div>
            </div>
          </div>

          {/* To-Do Section */}
          <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6">
            <h2 className="text-2xl font-semibold text-text-dark mb-4">To-Do</h2>

            {error && (
              <div className="mb-4 p-3 bg-accent/10 text-accent rounded-lg border border-accent">
                {error}
              </div>
            )}

            {/* Task List */}
            {loading ? (
              <div className="text-center py-8 text-text-light">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-text-light">
                No tasks yet. Click the + button to create your first task!
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      task.completed
                        ? "bg-accent/10 border-accent"
                        : "bg-bg border-primary-light hover:border-primary"
                    }`}
                  >
                    <button
                      onClick={() =>
                        onUpdateTask(task._id, { completed: !task.completed })
                      }
                      className="flex-shrink-0 text-2xl"
                    >
                      {task.completed ? "✅" : "⭕"}
                    </button>

                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          task.completed
                            ? "line-through text-text-light"
                            : "text-text-dark"
                        }`}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-sm text-text-light mt-1">
                          {task.description}
                        </div>
                      )}
                      {task.deadline && (
                        <div className="text-sm text-text-light mt-1">
                          Due: {new Date(task.deadline).toLocaleString()}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteTask(task._id)}
                      className="flex-shrink-0 p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors text-xl"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;