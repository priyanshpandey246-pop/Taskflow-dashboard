import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function TaskCard({ task, onDelete, onEdit, darkMode }) {
  const [hovered, setHovered] = useState(false);

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const baseBg = darkMode ? "#111827" : "#FFFFFF";
  const border = darkMode ? "#334155" : "#E5E7EB";
  const text = darkMode ? "#E5E7EB" : "#0F172A";
  const muted = darkMode ? "#CBD5E1" : "#64748B";

  const cardStyle = {
    backgroundColor: baseBg,
    color: text,
    border: `1px solid ${border}`,
    borderRadius: 20,
    padding: 16,
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
    boxShadow: hovered
      ? "0 18px 40px rgba(0,0,0,0.25)"
      : "0 6px 18px rgba(0,0,0,0.10)",
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "all 0.2s ease",
    opacity: isDragging ? 0.6 : 1,
    outline: "none",
    outlineOffset: isOverdue ? "6px" : "0px", 
  };

  const pillStyle = (bg, fg) => ({
    backgroundColor: bg,
    color: fg,
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    display: "inline-block",
  });

  const priorityPill =
    task.priority === "High"
      ? pillStyle(darkMode ? "rgba(127,29,29,0.35)" : "#FEE2E2", darkMode ? "#FECACA" : "#B91C1C")
      : task.priority === "Medium"
      ? pillStyle(darkMode ? "rgba(113,63,18,0.35)" : "#FEF3C7", darkMode ? "#FDE68A" : "#92400E")
      : pillStyle(darkMode ? "rgba(20,83,45,0.35)" : "#DCFCE7", darkMode ? "#BBF7D0" : "#166534");

  const chipStyle = {
    backgroundColor: darkMode ? "rgba(148,163,184,0.15)" : "#F1F5F9",
    color: darkMode ? "#E5E7EB" : "#334155",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Title + actions */}
      <div style={{ display: "flex",
         justifyContent: "space-between",
         alignItems: "flex-start",
          gap: 12,
          minWidth: 0,
          flexWrap: "wrap",
          width: "100%",
           }}>
        <div style={{ minWidth: 0,
          flex: 1,
          overflow: "hidden",
         }}>
         
          <div
            style={{
              cursor: "grab",
              fontWeight: 800,
              fontSize: 16,
              lineHeight: "20px",
              userSelect: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title="Drag to reorder"
          >
            {task.title}
          </div>

          {task.description ? (
            <div style={{ marginTop: 8, fontSize: 13, color: muted, lineHeight: "18px" }}>
              {task.description}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0, }}>
          <button
            aria-label="Edit task"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            style={{
              border: `1px solid ${border}`,
              background: "transparent",
              color: text,
              borderRadius: 12,
              padding: 8,
              cursor: "pointer",
            }}
          >
            <FaEdit size={14} />
          </button>

          <button
            aria-label="Delete task"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            style={{
              border: `1px solid ${border}`,
              background: "transparent",
              color: "#EF4444",
              borderRadius: 12,
              padding: 8,
              cursor: "pointer",
            }}
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>

     
      <div style={{ marginTop: 10, fontSize: 12, color: muted, lineHeight: "18px" }}>
        {task.assignee ? (
          <>
            Assignee: <span style={{ fontWeight: 700, color: text }}>{task.assignee}</span>{" "}
            ·{" "}
          </>
        ) : null}
        {task.dueDate || "No Due Date"}
        {isOverdue ? <span style={{ marginLeft: 8, color: "#F87171", fontWeight: 800 }}>Overdue</span> : null}
      </div>

      {/* Tags */}
      {(task.tags ?? []).length > 0 && (
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} style={chipStyle}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Comments preview */}
      {(task.comments ?? []).length > 0 && (
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {task.comments.slice(-2).map((c) => (
            <div
              key={c.id}
              style={{
                backgroundColor: darkMode ? "rgba(148,163,184,0.15)" : "#F8FAFC",
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: 10,
                fontSize: 12,
                color: darkMode ? "#E5E7EB" : "#334155",
              }}
            >
              {c.text}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 14,
         display: "flex",
         justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        }}>
        <span style={priorityPill}>{task.priority}</span>
        <span style={{ fontSize: 12, color: muted }}>#{task.id}</span>
      </div>
    </div>
  );
}


{/*import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaTrash, FaEdit, FaGripVertical } from "react-icons/fa";

export default function TaskCard({ task, onDelete, onEdit, darkMode }) {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const priorityPill =
    task.priority === "High"
      ? darkMode
        ? "bg-red-900/40 text-red-200"
        : "bg-red-100 text-red-700"
      : task.priority === "Medium"
      ? darkMode
        ? "bg-yellow-900/40 text-yellow-200"
        : "bg-yellow-100 text-yellow-700"
      : darkMode
      ? "bg-green-900/40 text-green-200"
      : "bg-green-100 text-green-700";

  return (
    <div
      ref={setNodeRef}
      style={dndStyle}
      className={`group rounded-3xl border shadow-sm transition-all duration-300
      hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-blue-400/30
      active:scale-[0.99]
      ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}
      ${isOverdue ? "ring-1 ring-red-400/70" : ""}`}
      {...attributes}
    >
      {/* TOP 
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {/* Drag handle row 
          <div className="flex items-center gap-2">
            <span className={`${darkMode ? "text-gray-400" : "text-gray-400"}`}>
              <FaGripVertical />
            </span> 

            <h3
              {...listeners}
              className="font-semibold cursor-grab active:cursor-grabbing select-none truncate leading-5"
              title="Drag to reorder"
            >
              {task.title}
            </h3>
          </div>

          {task.description ? (
            <p className={`mt-2 text-sm leading-5 ${darkMode ? "text-gray-300" : "text-gray-600"} line-clamp-2`}>
              {task.description}
            </p>
          ) : null}

          {/* Meta 
          <div className={`mt-3 text-xs leading-5 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            {task.assignee ? (
              <>
                Assignee: <span className="font-semibold">{task.assignee}</span> ·{" "}
              </>
            ) : null}
            {task.dueDate || "No Due Date"}
            {isOverdue ? <span className="ml-2 text-red-400 font-semibold">Overdue</span> : null}
          </div>

          {/* Tags 
          {(task.tags ?? []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {task.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`text-[11px] px-2.5 py-1 rounded-full
                  ${darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-700"}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions 
        <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            aria-label="Edit task"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className={`p-2.5 rounded-xl border transition-colors
            ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"}`}
          >
            <FaEdit size={14} />
          </button>

          <button
            aria-label="Delete task"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className={`p-2.5 rounded-xl border transition-colors
            ${darkMode ? "border-gray-700 hover:bg-red-900/30" : "border-gray-200 hover:bg-red-50"}`}
          >
            <FaTrash size={14} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* COMMENTS PREVIEW *
      {(task.comments ?? []).length > 0 && (
        <div className="px-5 pb-4">
          <div className="space-y-2">
            {task.comments.slice(-2).map((c) => (
              <div
                key={c.id}
                className={`text-xs p-2.5 rounded-2xl ${
                  darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-700"
                }`}
              >
                {c.text}
              </div>
            ))}
          </div>

          {task.comments.length > 2 && (
            <div className={`text-[11px] mt-2 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              +{task.comments.length - 2} more
            </div>
          )}
        </div>
      )}

      {/* FOOTER 
      <div className={`px-5 pb-5 flex items-center justify-between`}>
        <span className={`text-xs px-3 py-1 rounded-full ${priorityPill}`}>
          {task.priority}
        </span>
        <span className="text-xs text-gray-400">#{task.id}</span>
      </div>
    </div>
  );
}  */}