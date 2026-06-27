import { useEffect, useMemo, useState } from "react";

function TaskModal({
  isOpen,
  onClose,
  onAddTask,
  editingTask,
  onUpdateTask,
  onAddComment,
  onDeleteComment,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  darkMode,
}) {
  const [commentText, setCommentText] = useState("");
  const [subtaskText, setSubtaskText] = useState("");

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("todo");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const parseTags = (value) =>
    String(value ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  // fill form on edit
  useEffect(() => {
    if (!editingTask) return;

    setTitle(editingTask.title ?? "");
    setPriority(editingTask.priority ?? "Medium");
    setStatus(editingTask.status ?? "todo");
    setDescription(editingTask.description ?? "");
    setDueDate(editingTask.dueDate ?? "");
    setAssignee(editingTask.assignee ?? "");
    setTagsInput((editingTask.tags ?? []).join(", "));
  }, [editingTask]);

  const commentsCount = (editingTask?.comments ?? []).length;
  const doneSubtasks = (editingTask?.subtasks ?? []).filter((s) => s.done).length;
  const totalSubtasks = (editingTask?.subtasks ?? []).length;

  const modalBg = darkMode ? "#0B1220" : "#FFFFFF";
  const modalText = darkMode ? "#E5E7EB" : "#0F172A";
  const border = darkMode ? "#334155" : "#D1D5DB";
  const softBg = darkMode ? "rgba(148,163,184,0.10)" : "#F8FAFC";

  const fieldStyle = useMemo(
    () => ({
      width: "100%",
      height: 44,
      padding: "0 14px",
      borderRadius: 14,
      border: `1px solid ${border}`,
      backgroundColor: darkMode ? "#0F172A" : "#FFFFFF",
      color: darkMode ? "#E5E7EB" : "#0F172A",
      outline: "none",
      boxSizing: "border-box",
    }),
    [darkMode, border]
  );

  const textareaStyle = useMemo(
    () => ({
      ...fieldStyle,
      height: "auto",
      minHeight: 90,
      padding: "12px 14px",
      resize: "vertical",
      lineHeight: "1.35rem",
    }),
    [fieldStyle]
  );

  const smallBtnStyle = useMemo(
    () => ({
      height: 44,
      padding: "0 14px",
      borderRadius: 12,
      border: `1px solid ${border}`,
      backgroundColor: darkMode ? "#111827" : "#F3F4F6",
      color: darkMode ? "#E5E7EB" : "#111827",
      cursor: "pointer",
      fontWeight: 700,
      transition: "all 0.15s ease",
    }),
    [darkMode, border]
  );

  const primaryBtnStyle = useMemo(
    () => ({
      ...smallBtnStyle,
      backgroundColor: "#2563EB",
      border: "1px solid #1D4ED8",
      color: "#fff",
      boxShadow: "0 6px 14px rgba(37,99,235,0.25)",
    }),
    [smallBtnStyle]
  );

  const handleClose = () => {
    setCommentText("");
    setSubtaskText("");
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title,
        priority,
        status,
        dueDate,
        description,
        assignee,
        tags: parseTags(tagsInput),
      });
    } else {
      const newTask = {
        id: Date.now().toString(),
        title,
        description,
        priority,
        status,
        dueDate,
        assignee,
        tags: parseTags(tagsInput),
        comments: [],
        subtasks: [],
        order: Date.now(),
      };
      onAddTask(newTask);
    }

    // reset form
    setTitle("");
    setPriority("Medium");
    setStatus("todo");
    setDueDate("");
    setDescription("");
    setAssignee("");
    setTagsInput("");

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        padding: 16,
      }}
    >
      <div
        className="animate-pop-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        style={{
          width: 520,
          maxWidth: "95vw",
          maxHeight: "85vh",
          overflow: "auto",
          backgroundColor: modalBg,
          color: modalText,
          borderRadius: 22,
          border: `1px solid ${border}`,
          boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
          padding: 22,
        }}
      >
        <h2
          id="task-modal-title"
          style={{ fontSize: 22, fontWeight: 900, margin: 0, marginBottom: 14 }}
        >
          {editingTask ? "Edit Task" : "Create New Task"}
        </h2>

        {/* FORM */}
        <div style={{ display: "grid", gap: 12 }}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={fieldStyle}
          />

          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={textareaStyle}
          />

          <input
            type="text"
            placeholder="Assignee (e.g., Rahul)"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            style={fieldStyle}
          />

          <input
            type="text"
            placeholder="Tags (comma separated: ui, bug, api)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            style={fieldStyle}
          />

          
          {editingTask && (
            <div
              style={{
                border: `1px solid ${border}`,
                borderRadius: 18,
                padding: 14,
                background: softBg,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 900 }}>
                  Checklist ({doneSubtasks}/{totalSubtasks})
                </div>
                <div style={{ fontWeight: 900 }}>Comments ({commentsCount})</div>
              </div>

              {/* Subtask add */}
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={subtaskText}
                  onChange={(e) => setSubtaskText(e.target.value)}
                  style={{ ...fieldStyle, height: 42 }}
                />
                <button
                  type="button"
                  style={{ ...primaryBtnStyle, height: 42 }}
                  onClick={() => {
                    const v = subtaskText.trim();
                    if (!v) return;
                    onAddSubtask(editingTask.id, v);
                    setSubtaskText("");
                  }}
                >
                  Add
                </button>
              </div>

              {/* Subtask list */}
              <div style={{ marginTop: 12, display: "grid", gap: 10, maxHeight: 130, overflow: "auto" }}>
                {(editingTask.subtasks ?? []).length === 0 ? (
                  <div style={{ fontSize: 12, opacity: 0.8 }}>No subtasks yet.</div>
                ) : (
                  (editingTask.subtasks ?? []).map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        border: `1px solid ${border}`,
                        borderRadius: 14,
                        padding: "10px 12px",
                        background: darkMode ? "rgba(2,6,23,0.35)" : "#fff",
                      }}
                    >
                      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                        <input
                          type="checkbox"
                          checked={!!s.done}
                          onChange={() => onToggleSubtask(editingTask.id, s.id)}
                        />
                        <span style={{ textDecoration: s.done ? "line-through" : "none", opacity: s.done ? 0.7 : 1 }}>
                          {s.text}
                        </span>
                      </label>

                      <button
                        type="button"
                        style={{ ...smallBtnStyle, height: 34, padding: "0 10px", color: "#EF4444" }}
                        onClick={() => onDeleteSubtask(editingTask.id, s.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Comment add */}
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ ...fieldStyle, height: 42 }}
                />
                <button
                  type="button"
                  style={{ ...primaryBtnStyle, height: 42 }}
                  onClick={() => {
                    const v = commentText.trim();
                    if (!v) return;
                    onAddComment(editingTask.id, v);
                    setCommentText("");
                  }}
                >
                  Add
                </button>
              </div>

              {/* Comments list */}
              <div style={{ marginTop: 12, display: "grid", gap: 10, maxHeight: 140, overflow: "auto" }}>
                {(editingTask.comments ?? []).length === 0 ? (
                  <div style={{ fontSize: 12, opacity: 0.8 }}>No comments yet.</div>
                ) : (
                  [...(editingTask.comments ?? [])]
                    .slice()
                    .reverse()
                    .map((c) => (
                      <div
                        key={c.id}
                        style={{
                          border: `1px solid ${border}`,
                          borderRadius: 14,
                          padding: "10px 12px",
                          background: darkMode ? "rgba(2,6,23,0.35)" : "#fff",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <div style={{ fontSize: 11, opacity: 0.75 }}>
                            {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                          </div>
                          <button
                            type="button"
                            style={{ ...smallBtnStyle, height: 30, padding: "0 10px", color: "#EF4444" }}
                            onClick={() => onDeleteComment(editingTask.id, c.id)}
                          >
                            Delete
                          </button>
                        </div>
                        <div style={{ marginTop: 6, fontSize: 13 }}>{c.text}</div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={fieldStyle}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)} style={fieldStyle}>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={fieldStyle} />
        </div>

        {/* Footer buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
          <button type="button" onClick={handleClose} style={smallBtnStyle}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} style={primaryBtnStyle}>
            {editingTask ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
