import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../api/tasks";
import { colorFor } from "../lib/colors";

function progressFromSubtasks(subtasks) {
  if (!subtasks || subtasks.length === 0) return null;
  const done = subtasks.filter((s) => s.done).length;
  return Math.round((done / subtasks.length) * 100);
}

function deriveDone(task) {
  const auto = progressFromSubtasks(task.subtasks);
  if (auto !== null) return { ...task, progress: auto, done: auto === 100 };
  return task;
}

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceTimers = useRef(new Map());

  useEffect(() => {
    let alive = true;
    api
      .listTasks()
      .then((data) => {
        if (!alive) return;
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const addTask = useCallback(async (title, opts = {}) => {
    const trimmed = (title || "").trim();
    if (!trimmed) return null;
    const optimistic = {
      _id: `tmp-${Date.now()}`,
      title: trimmed,
      color: opts.color || colorFor(trimmed),
      scope: opts.scope === "day" ? "day" : "inbox",
      bucketKey: opts.bucketKey || "",
      order: Date.now(),
      done: false,
      subtasks: [],
      progress: 0,
      notes: "",
      _pending: true,
    };
    setTasks((prev) => [...prev, optimistic]);
    try {
      const saved = await api.createTask(optimistic);
      setTasks((prev) =>
        prev.map((t) => (t._id === optimistic._id ? saved : t)),
      );
      return saved;
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t._id !== optimistic._id));
      setError(err.message);
      return null;
    }
  }, []);

  const patchTaskLocal = useCallback((id, patch) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? deriveDone({ ...t, ...patch }) : t)),
    );
  }, []);

  const flushPatch = useCallback(async (id, patch) => {
    try {
      const saved = await api.updateTask(id, patch);
      setTasks((prev) => prev.map((t) => (t._id === id ? saved : t)));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const updateTask = useCallback(
    (id, patch, { debounce = 0 } = {}) => {
      patchTaskLocal(id, patch);
      const timers = debounceTimers.current;
      const existing = timers.get(id);
      if (existing) clearTimeout(existing);
      if (debounce > 0) {
        const t = setTimeout(() => {
          timers.delete(id);
          flushPatch(id, patch);
        }, debounce);
        timers.set(id, t);
      } else {
        flushPatch(id, patch);
      }
    },
    [patchTaskLocal, flushPatch],
  );

  const moveTask = useCallback(
    (id, scope, bucketKey, order) => {
      updateTask(id, {
        scope,
        bucketKey: scope === "day" ? bucketKey : "",
        order: typeof order === "number" ? order : Date.now(),
      });
    },
    [updateTask],
  );

  const removeTask = useCallback(
    async (id) => {
      const previous = tasks;
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (typeof id === "string" && id.startsWith("tmp-")) {
        return;
      }
      try {
        await api.deleteTask(id);
      } catch (err) {
        setTasks(previous);
        setError(err.message);
      }
    },
    [tasks],
  );

  const addSubtask = useCallback(
    (taskId, title, date) => {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;
      const trimmed = (title || "").trim();
      if (!trimmed) return;
      const sub = {
        id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: trimmed,
        done: false,
        date: date || "",
      };
      const subtasks = [...(task.subtasks || []), sub];
      updateTask(taskId, { subtasks }, { debounce: 250 });
      return sub;
    },
    [tasks, updateTask],
  );

  const toggleSubtask = useCallback(
    (taskId, subtaskId) => {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;
      const subtasks = (task.subtasks || []).map((s) =>
        s.id === subtaskId ? { ...s, done: !s.done } : s,
      );
      updateTask(taskId, { subtasks }, { debounce: 250 });
    },
    [tasks, updateTask],
  );

  const editSubtask = useCallback(
    (taskId, subtaskId, patch) => {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;
      const subtasks = (task.subtasks || []).map((s) =>
        s.id === subtaskId ? { ...s, ...patch } : s,
      );
      updateTask(taskId, { subtasks }, { debounce: 250 });
    },
    [tasks, updateTask],
  );

  const removeSubtask = useCallback(
    (taskId, subtaskId) => {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;
      const subtasks = (task.subtasks || []).filter((s) => s.id !== subtaskId);
      updateTask(taskId, { subtasks }, { debounce: 250 });
    },
    [tasks, updateTask],
  );

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    moveTask,
    removeTask,
    addSubtask,
    toggleSubtask,
    editSubtask,
    removeSubtask,
  };
}
