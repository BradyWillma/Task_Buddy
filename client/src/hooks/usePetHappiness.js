import { useMemo } from "react";

export default function usePetHappiness(tasks) {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const completedThisWeek = tasks.filter((task) => {
      if (!task.completed) return false;
      const completedDate = new Date(task.updatedAt || task.createdAt);
      return completedDate >= weekStart;
    }).length;

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
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const petHappiness = Math.min(100, streak * 10 + completedThisWeek * 20);

    return {
      completedThisWeek,
      streak,
      petHappiness,
    };
  }, [tasks]);
}
