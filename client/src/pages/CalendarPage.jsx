function groupTasksByDate(tasks) {
  const map = new Map();
  tasks.forEach((task) => {
    if (!task.deadline) return;
    const d = new Date(task.deadline);
    const key = d.toLocaleDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(task);
  });
  return Array.from(map.entries());
}

function CalendarPage({ tasks, loading }) {
  const grouped = groupTasksByDate(tasks);

  return (
    <section>
      <h2>Calendar</h2>
      <p className="section-subtitle">
        Simple view of tasks grouped by due date.
      </p>

      {loading ? (
        <p>Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p>No tasks to show.</p>
      ) : (
        <div className="card">
          {grouped.map(([date, dayTasks]) => (
            <div key={date} className="calendar-day">
              <h3>{date}</h3>
              <ul>
                {dayTasks.map((task) => (
                  <li key={task._id}>{task.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CalendarPage;
