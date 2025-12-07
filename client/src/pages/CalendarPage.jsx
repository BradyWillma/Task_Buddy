import { useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarPage({ tasks, loading, onUpdateTask, onDeleteTask }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  const tasksByDate = useMemo(() => {
    const map = new Map();
    tasks.forEach((task) => {
      if (!task.deadline) return;
      const d = new Date(task.deadline);
      const key = toDateKey(d);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(task);
    });
    return map;
  }, [tasks]);

  const calendarDays = useMemo(
    () => buildCalendarDays(currentMonth),
    [currentMonth]
  );

  const getTaskColorClass = (task, taskDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(taskDate);
    deadline.setHours(0, 0, 0, 0);

    if (deadline < today) {
      return "bg-bg-card";
    }

    if (task.completed) {
      return "bg-green-200";
    }

    const daysUntil = Math.floor((deadline - today) / (1000 * 60 * 60 * 24));

    if (daysUntil <= 1) {
      return "bg-red-200";
    } else if (daysUntil <= 3) {
      return "bg-yellow-200/75";
    } else {
      return "bg-bg-card";
    }
  };

  const handleDayClick = (cell) => {
    if (!cell.date) return;
    const key = toDateKey(cell.date);
    const dayTasks = tasksByDate.get(key) || [];
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setSelectedDay({
      date: cell.date,
      dayName: dayNames[cell.date.getDay()],
      dateStr: `${cell.date.getMonth() + 1}/${cell.date.getDate()}`,
      fullDate: cell.date.toDateString(),
      tasks: dayTasks
    });
    setIsDayModalOpen(true);
  };

  function prevMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }

  const monthLabel = currentMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <>
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

            {selectedDay.tasks.length === 0 ? (
              <div className="text-center py-8 text-text-light">
                No tasks scheduled for this day
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDay.tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`flex items-center gap-4 p-4 rounded-lg bg-bg shadow-[0px_6px_0_#c9c5bf] ${
                      task.completed
                        ? "bg-accent/10 border border-accent"
                        : "bg-bg border border-primary-light"
                    }`}
                  >
                    <button
                      onClick={() => onUpdateTask(task._id, { completed: !task.completed })}
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
      )}

      <div className="min-h-screen bg-bg pt-6 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-dark mb-2">Calendar</h1>
            <p className="text-text-light">See your tasks laid out in a monthly calendar.</p>
          </div>

          <div className="bg-bg-card rounded-2xl shadow-[0_6px_3px_#c9c5bf] p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevMonth}
                className="w-10 h-10 rounded-lg shadow-[0_3px_2px_#c9c5bf] bg-bg text-text-dark hover:bg-primary-light/30 active:translate-y-0.5 flex items-center justify-center transition-all"
              >
                ←
              </button>
              <div className="text-2xl font-semibold text-text-dark">{monthLabel}</div>
              <button
                onClick={nextMonth}
                className="w-10 h-10 rounded-lg shadow-[0_3px_2px_#c9c5bf] bg-bg text-text-dark hover:bg-primary-light/30 active:translate-y-0.5 flex items-center justify-center transition-all"
              >
                →
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-text-light">Loading tasks...</div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-text-dark py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((cell, idx) => {
                    const key = cell.date ? toDateKey(cell.date) : `empty-${idx}`;
                    const dayTasks = cell.date ? tasksByDate.get(key) || [] : [];

                    return (
                      <div
                        key={key}
                        onClick={() => handleDayClick(cell)}
                        className={`min-h-[120px] rounded-lg bg-bg shadow-[0_3px_2px_#c9c5bf] p-2 cursor-pointer hover:shadow-[0_4px_3px_#b0aca6] transition-all overflow-hidden ${
                          cell.inCurrentMonth ? "" : "opacity-40"
                        }`}
                      >
                        {cell.date && (
                          <div className="text-sm font-semibold text-text-dark mb-2">
                            {cell.date.getDate()}
                          </div>
                        )}

                        {dayTasks.length > 0 && (
                          <div className="relative overflow-hidden pb-1">
                            <div className="space-y-1">
                              {dayTasks.slice(0, 4).map((t) => (
                                <div
                                  key={t._id}
                                  className={`text-xs px-2 py-1 rounded shadow-[0px_2px_0_#c9c5bf] ${getTaskColorClass(t, cell.date)} truncate hover:bg-primary-light/50 active:translate-y-0.5 transition-all hover:scale-105 ${
                                    t.completed ? "line-through text-text-light" : "text-text-dark"
                                  }`}
                                >
                                  {t.title}
                                </div>
                              ))}
                            </div>
                            {dayTasks.length > 3 && (
                              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#fff7f0] to-transparent pointer-events-none z-10" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function toDateKey(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const firstDayIndex = firstOfMonth.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = 0; i < firstDayIndex; i++) {
    const day = daysInPrevMonth - firstDayIndex + 1 + i;
    cells.push({
      date: new Date(year, month - 1, day),
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    });
  }

  const totalCells = Math.ceil(cells.length / 7) * 7;
  const extraCells = totalCells - cells.length;

  for (let i = 1; i <= extraCells; i++) {
    cells.push({
      date: new Date(year, month + 1, i),
      inCurrentMonth: false,
    });
  }

  return cells;
}

export default CalendarPage;