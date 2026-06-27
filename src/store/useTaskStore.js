import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultTasks = [
  { id: "1", title: "Setup project", status: "todo", priority: "High" },
  { id: "2", title: "Build UI components", status: "inprogress", priority: "Medium" },
  { id: "3", title: "Write docs", status: "review", priority: "Low" },
  { id: "4", title: "Deploy app", status: "done", priority: "High" },
];

const makeId = () =>
  (crypto?.randomUUID && crypto.randomUUID()) ||
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeTask = (t) => ({
  id: String(t.id),
  title: t.title ?? "",
  description: t.description ?? "",
  status: t.status ?? "todo",
  priority: t.priority ?? "Medium",
  dueDate: t.dueDate ?? "",
  order: t.order ?? 0,

  assignee: t.assignee ?? "",
  tags: Array.isArray(t.tags) ? t.tags : [],

  comments: Array.isArray(t.comments)
    ? t.comments.map((c, idx) =>
        typeof c === "string"
          ? { id: `${t.id}-c-${idx}`, text: c, createdAt: new Date().toISOString() }
          : {
              id: c.id ?? `${t.id}-c-${idx}`,
              text: c.text ?? "",
              createdAt: c.createdAt ?? new Date().toISOString(),
            }
      )
    : [],

  subtasks: Array.isArray(t.subtasks)
    ? t.subtasks.map((s, idx) =>
        typeof s === "string"
          ? { id: `${t.id}-s-${idx}`, text: s, done: false }
          : {
              id: s.id ?? `${t.id}-s-${idx}`,
              text: s.text ?? "",
              done: !!s.done,
            }
      )
    : [],
});

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],

      // Seed once if empty
      seedIfEmpty: () => {
        const current = get().tasks;
        if (current.length > 0) return;

        const seeded = defaultTasks.map((t, idx) =>
          normalizeTask({ ...t, comments: [], subtasks: [], tags: [], assignee: "You", order: idx })
        );

        set({ tasks: seeded });
      },

      // This keeps your existing KanbanBoard code working (prev => next)
      setTasks: (updater) => {
        set((state) => {
          const next = typeof updater === "function" ? updater(state.tasks) : updater;
          return { tasks: (next ?? []).map(normalizeTask) };
        });
      },

      addTask: (task) => {
        set((state) => ({
          tasks: [...state.tasks, normalizeTask({ ...task, order: task.order ?? Date.now() })],
        }));
      },

      updateTask: (updated) => {
        const updatedId = String(updated?.id);
        set((state) => ({
          tasks: state.tasks.map((t) => {if (String(t.id) !== updatedId) return t;
            return normalizeTask({...t, ...updated, id: updatedId});
        }),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },

      addComment: (taskId, text) => {
        const trimmed = String(text ?? "").trim();
        if (!trimmed) return;

        const comment = { id: makeId(), text: trimmed, createdAt: new Date().toISOString() };

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, comments: [...(t.comments ?? []), comment] } : t
          ),
        }));
      },

      deleteComment: (taskId, commentId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, comments: (t.comments ?? []).filter((c) => c.id !== commentId) }
              : t
          ),
        }));
      },

      addSubtask: (taskId, text) => {
        const trimmed = String(text ?? "").trim();
        if (!trimmed) return;

        const subtask = { id: makeId(), text: trimmed, done: false };

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, subtasks: [...(t.subtasks ?? []), subtask] } : t
          ),
        }));
      },

      toggleSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: (t.subtasks ?? []).map((s) =>
                    s.id === subtaskId ? { ...s, done: !s.done } : s
                  ),
                }
              : t
          ),
        }));
      },

      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: (t.subtasks ?? []).filter((s) => s.id !== subtaskId) }
              : t
          ),
        }));
      },
    }),
    {
      name: "taskflow-tasks", // localStorage key
    }
  )
);