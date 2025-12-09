// src/pages/HomePage.jsx (or wherever you keep it)

import { useState, useMemo } from "react";
import { computePetStats } from "../utils/petStats";

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
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const TASKS_PER_PAGE = 5;

  // 🔹 Shared time-based stats + happiness using useMemo
  const { completedThisWeek, streak, petHappiness } = useMemo(
    () => computePetStats(tasks),
    [tasks]
  );

  // 🔹 Pet mood based on petHappiness
  const getPetEmoji = () => {
    if (petHappiness >= 80) return "😺";
    if (petHappiness >= 40) return "😼";
    return "😿";
  };

  const getPetMoodText = () => {
    if (petHappiness >= 80) return "Your pet is thrilled!";
    if (petHappiness >= 40) return "Your pet is doing fine.";
    return "Your pet is feeling neglected...";
  };

  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);

      days.push({
        date: date,
        dayName: dayNames[date.getDay()],
        dateStr: `${date.getMonth() + 1}/${date.getDate()}`,
        fullDate: date.toDateString(),
      });
    }

    return days;
  };

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === date.getTime();
    });
  };

  const getTaskColorClass = (task, isInWeeklyView = false) => {
    if (task.completed) {
      return isInWeeklyView
        ? "bg-green-200 shadow-[0_2px_0_#c9c5bf] text-dark border-primary-light hover:bg-primary-light/50 active:translate-y-0.5 shadow transition-all hover:scale-105"
        : "bg-green-200";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.deadline);
    taskDate.setHours(0, 0, 0, 0);

    const daysUntil = Math.floor(
      (taskDate - today) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil <= 1) {
      return isInWeeklyView
        ? "bg-red-200 shadow-[0_2px_0_#c9c5bf] text-dark border-primary-light hover:bg-primary-light/50 active:translate-y-0.5 shadow transition-all hover:scale-105"
        : "bg-red-200";
    } else if (daysUntil <= 3) {
      return isInWeeklyView
        ? "bg-yellow-200/75 shadow-[0_2px_0_#c9c5bf] text-dark border-primary-light hover:bg-primary-light/50 active:translate-y-0.5 shadow transition-all hover:scale-105"
        : "bg-yellow-200/75";
    } else {
      return isInWeeklyView
        ? "bg-bg-card shadow-[0_2px_0_#c9c5bf] text-dark border-primary-light hover:bg-primary-light/50 active:translate-y-0.5 shadow transition-all hover:scale-105"
        : "bg-bg-card";
    }
  };

  const handleDayClick = (dayInfo) => {
    setSelectedDay(dayInfo);
    setIsDayModalOpen(true);
  };

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

  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {/* Day modal */}
      {isDayModalOpen && selectedDay && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsDayModalOpen(false)}
        >
          <div
            className="bg-bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsDayModalOpen(false)}
              className="absolute top-4 right-4 text-text-light hover:text-text-dark text-2xl"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold text-dark mb-2">
              {selectedDay.dayName} - {selectedDay.dateStr}
            </h3>
            <p className="text-text-light mb-6">{selectedDay.fullDate}</p>

            {(() => {
              const dayTasks = getTasksForDate(selectedDay.date);
              return dayTasks.length === 0 ? (
                <div className="text-center py-8 text-text-light">
                  No tasks scheduled for this day
                </div>
              ) : (
                <div className="space-y-3">
                  {dayTasks.map((task) => (
                    <div
                      key={task._id}
                      className={`flex items-center gap-4 p-4 rounded-lg bg-bg shadow-[0px_6px_0_#c9c5bf] ${
                        task.completed
                          ? "bg-accent/10 border border-accent"
                          : "bg-bg border border-primary-light"
                      }`}
                    >
                      <button
                        onClick={() =>
                          onUpdateTask(task._id, {
                            completed: !task.completed,
                          })
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
                            Due: {new Date(
                              task.deadline
                            ).toLocaleString()}
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
              );
            })()}
          </div>
        </div>
      )}

      {/* Create Task modal */}
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

            <h3 className="text-2xl font-bold text-dark mb-6">
              Create Task
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Title <span className="text-dark">*</span>
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
                  onChange={(e) =>
                    setNewTaskDescription(e.target.value)
                  }
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
                  onChange={(e) =>
                    setNewTaskDeadline(e.target.value)
                  }
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

      {/* Main layout */}
      <div className="min-h-screen bg-bg pt-6 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Floating + button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-[0_6px_0_#5a86c4] transition-all hover:scale-110 flex items-center justify-center z-40 active:translate-y-0.5"
          >
            <span className="text-4xl font-light leading-none">
              +
            </span>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-dark mb-2">
              Task Buddy
            </h1>
            <p className="text-text-light">
              Complete tasks to keep your pet happy!
            </p>
          </div>

          {/* Weekly progress cards */}
          <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6 mb-6">
            <h2 className="text-xl font-semibold text-text-dark mb-4">
              Weekly Progress
            </h2>
            <div className="flex justify-around items-center gap-2">
              {getNext7Days().map((dayInfo, index) => {
                const dayTasks = getTasksForDate(dayInfo.date);

                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(dayInfo)}
                    className="flex flex-col w-full max-w-[140px] h-[160px] rounded-2xl shadow-[0_3px_2px_#c9c5bf] bg-bg cursor-pointer hover:shadow-[0_4px_3px_#b0aca6] transition-all overflow-hidden"
                  >
                    <div className="text-center pt-2 pb-1 px-2">
                      <span className="text-sm font-semibold text-text-dark">
                        {dayInfo.dayName}
                      </span>
                      <div className="text-xs text-text-light">
                        {dayInfo.dateStr}
                      </div>
                    </div>
                    <div className="flex-1 px-2 pb-2 overflow-hidden relative">
                      {dayTasks.length > 0 && (
                        <>
                          <div className="space-y-1">
                            {dayTasks.slice(0, 4).map((task) => (
                              <div
                                key={task._id}
                                className={`text-xs px-2 py-1 rounded ${getTaskColorClass(
                                  task,
                                  true
                                )} truncate`}
                              >
                                {task.title}
                              </div>
                            ))}
                          </div>
                          {dayTasks.length > 3 && (
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#fff7f0] to-transparent pointer-events-none" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Completed this week */}
            <div className="bg-bg-card rounded-2xl p-6 shadow-[0_6px_3px_#c9c5bf]">
              <h3 className="text-lg font-semibold text-text-dark mb-4">
                Tasks Completed
              </h3>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-2 block">✅</span>
                  <div className="text-green-300 text-5xl font-bold mb-2">
                    {completedThisWeek}
                  </div>
                  <div className="text-text-light">This Week</div>
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6">
              <h3 className="text-lg font-semibold text-text-dark mb-4">
                Current Streak
              </h3>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-2 block">🔥</span>
                  <div className="text-5xl font-bold text-orange-400">
                    {streak}
                  </div>
                  <div className="text-text-light">Days</div>
                </div>
              </div>
            </div>

            {/* Pet happiness */}
            <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-dark">
                  Pet Happiness
                </h3>
                <div className="text-lg font-semibold text-text-dark">
                  {petHappiness}%
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-bg rounded-full h-4 shadow-[0_3px_1px_#c9c5bf]">
                  <div
                    className="bg-accent h-4 rounded-full transition-all duration-500"
                    style={{ width: `${petHappiness}%` }}
                  />
                </div>
              </div>

              <div className="bg-bg rounded-2xl p-8 flex flex-col items-center justify-center shadow-[0_3px_3px_#c9c5bf]">
                <span className="text-7xl mb-2">{getPetEmoji()}</span>
                <span className="text-sm text-text-light text-center">
                  {getPetMoodText()}
                </span>
              </div>
            </div>
          </div>

          {/* To-Do List */}
          <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-text-dark">
                To-Do
              </h2>

              {tasks.length > TASKS_PER_PAGE && (
                <div className="flex gap-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 rounded-lg shadow-[0_3px_2px_#c9c5bf] flex items-center justify-center transition-all ${
                      currentPage === 1
                        ? "bg-bg-card-dark text-text-light cursor-not-allowed"
                        : "bg-bg text-text-dark hover:bg-primary-light/30 active:translate-y-0.5"
                    }`}
                  >
                    ←
                  </button>
                  <div className="w-10 h-10 rounded-lg shadow-[0_3px_2px_#c9c5bf] bg-primary text-white flex items-center justify-center font-semibold">
                    {currentPage}
                  </div>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 rounded-lg shadow-[0_3px_2px_#c9c5bf] flex items-center justify-center transition-all ${
                      currentPage === totalPages
                        ? "bg-bg-card-dark text-text-light cursor-not-allowed"
                        : "bg-bg text-text-dark hover:bg-primary-light/30 active:translate-y-0.5"
                    }`}
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-accent/10 text-accent rounded-lg border border-accent">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8 text-text-light">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-text-light">
                No tasks yet. Click the + button to create your first
                task!
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`flex items-center gap-4 p-4 rounded-lg shadow-[0_3px_2px_#c9c5bf] transition-all ${
                      task.completed
                        ? "bg-accent/10 border-accent"
                        : "bg-bg border-primary-light hover:border-primary"
                    }`}
                  >
                    <button
                      onClick={() =>
                        onUpdateTask(task._id, {
                          completed: !task.completed,
                        })
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
                          Due: {new Date(
                            task.deadline
                          ).toLocaleString()}
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
