import { useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarPage({ tasks, loading }) {
  // first day of the current month
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // group tasks by date key: "YYYY-MM-DD"
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

  // build calendar cells for current month (including leading/trailing days)
  const calendarDays = useMemo(
    () => buildCalendarDays(currentMonth),
    [currentMonth]
  );

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
    <section>
      <h2>Calendar</h2>
      <p className="section-subtitle">
        See your tasks laid out in a monthly calendar.
      </p>

      <div className="card calendar-card">
        <div className="calendar-header">
          <button className="btn-secondary" onClick={prevMonth}>
            ←
          </button>
          <div className="calendar-month-label">{monthLabel}</div>
          <button className="btn-secondary" onClick={nextMonth}>
            →
          </button>
        </div>

        {loading ? (
          <p>Loading tasks…</p>
        ) : (
          <>
            <div className="calendar-weekdays">
              {WEEKDAYS.map((day) => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((cell, idx) => {
                const key = cell.date ? toDateKey(cell.date) : `empty-${idx}`;
                const dayTasks = cell.date ? tasksByDate.get(key) || [] : [];

                return (
                  <div
                    key={key}
                    className={
                      "calendar-cell" +
                      (cell.inCurrentMonth ? "" : " calendar-cell--faded")
                    }
                  >
                    {cell.date && (
                      <div className="calendar-cell-date">
                        {cell.date.getDate()}
                      </div>
                    )}

                    {dayTasks.length > 0 && (
                      <ul className="calendar-cell-tasks">
                        {dayTasks.slice(0, 3).map((t) => (
                          <li key={t._id}>{t.title}</li>
                        ))}
                        {dayTasks.length > 3 && (
                          <li className="calendar-cell-more">
                            +{dayTasks.length - 3} more
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */

// Date → "YYYY-MM-DD"
function toDateKey(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Build array of { date: Date, inCurrentMonth: boolean }
function buildCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const firstDayIndex = firstOfMonth.getDay(); // 0–6 (Sun–Sat)

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  // leading days from previous month
  for (let i = 0; i < firstDayIndex; i++) {
    const day = daysInPrevMonth - firstDayIndex + 1 + i;
    cells.push({
      date: new Date(year, month - 1, day),
      inCurrentMonth: false,
    });
  }

  // current month
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    });
  }

  // trailing days to fill full weeks (multiple of 7 cells)
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
