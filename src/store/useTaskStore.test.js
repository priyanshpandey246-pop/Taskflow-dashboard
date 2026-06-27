import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "./useTaskStore";

beforeEach(() => {
  useTaskStore.persist?.clearStorage?.();
  localStorage.removeItem("taskflow-tasks");
  useTaskStore.setState({ tasks: [] });
});

describe("useTaskStore (unit tests)", () => {
  it("seeds default tasks when empty", () => {
    useTaskStore.getState().seedIfEmpty();
    expect(useTaskStore.getState().tasks.length).toBeGreaterThan(0);
  });

  it("adds a task", () => {
    useTaskStore.getState().addTask({
      id: "t1",
      title: "Hello",
      status: "todo",
      priority: "High",
    });
    expect(useTaskStore.getState().tasks.some((t) => t.id === "t1")).toBe(true);
  });

  it("updates a task title", () => {
    useTaskStore.getState().addTask({
      id: "t2",
      title: "Old",
      status: "todo",
      priority: "Low",
    });
    useTaskStore.getState().updateTask({ id: "t2", title: "New" });
    expect(useTaskStore.getState().tasks.find((t) => t.id === "t2").title).toBe("New");
  });

  it("deletes a task", () => {
    useTaskStore.getState().addTask({
      id: "t3",
      title: "Delete me",
      status: "todo",
      priority: "Low",
    });
    useTaskStore.getState().deleteTask("t3");
    expect(useTaskStore.getState().tasks.some((t) => t.id === "t3")).toBe(false);
  });

  it("adds and deletes a comment", () => {
    useTaskStore.getState().addTask({
      id: "t4",
      title: "Task",
      status: "todo",
      priority: "Low",
    });

    useTaskStore.getState().addComment("t4", "Nice");
    let task = useTaskStore.getState().tasks.find((t) => t.id === "t4");
    expect(task.comments.length).toBe(1);

    useTaskStore.getState().deleteComment("t4", task.comments[0].id);
    task = useTaskStore.getState().tasks.find((t) => t.id === "t4");
    expect(task.comments.length).toBe(0);
  });

  it("adds and toggles a subtask", () => {
    useTaskStore.getState().addTask({
      id: "t5",
      title: "Task",
      status: "todo",
      priority: "Low",
    });

    useTaskStore.getState().addSubtask("t5", "Sub 1");
    let task = useTaskStore.getState().tasks.find((t) => t.id === "t5");
    const subId = task.subtasks[0].id;

    useTaskStore.getState().toggleSubtask("t5", subId);
    task = useTaskStore.getState().tasks.find((t) => t.id === "t5");
    expect(task.subtasks[0].done).toBe(true);
  });
});