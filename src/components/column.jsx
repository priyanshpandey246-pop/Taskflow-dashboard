import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

export default function Column({ id, title, tasks, onDelete, onEdit, darkMode, sortBy }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const priorityRank = { High: 3, Medium: 2, Low: 1 };

  const sorted = [...tasks].sort((a, b) => {
    if (sortBy === "manual") return (a.order ?? 0) - (b.order ?? 0);

    if (sortBy === "title_asc")
      return (a.title ?? "").toLowerCase().localeCompare((b.title ?? "").toLowerCase());

    if (sortBy === "priority_desc")
      return (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0);

    const aTime = a.dueDate ? new Date(a.dueDate).getTime() : NaN;
    const bTime = b.dueDate ? new Date(b.dueDate).getTime() : NaN;

    const aVal = Number.isFinite(aTime) ? aTime : Infinity;
    const bVal = Number.isFinite(bTime) ? bTime : Infinity;

    if (sortBy === "due_asc") return aVal - bVal;
    if (sortBy === "due_desc") return bVal - aVal;

    return 0;
  });

  const bg = darkMode ? "rgba(15,23,42,0.35)" : "rgba(255,255,255,0.75)";
  const border = darkMode ? "#334155" : "#E5E7EB";
  const text = darkMode ? "#E5E7EB" : "#0F172A";
  const sub = darkMode ? "#CBD5E1" : "#64748B";

  const accent =
    id === "todo"
      ? "#3B82F6"
      : id === "inprogress"
      ? "#F59E0B"
      : id === "review"
      ? "#8B5CF6"
      : "#10B981";

  return (
    <div
      ref={setNodeRef}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 24,
        boxShadow: isOver ? "0 20px 45px rgba(0,0,0,0.28)" : "0 10px 30px rgba(0,0,0,0.10)",
        transition: "all 0.2s ease",
        outline: isOver ? `2px solid ${accent}` : "none",
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ padding: 16, borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: accent }} />
            <div style={{ fontWeight: 900, color: text }}>{title}</div>
          </div>

          <span
            style={{
              backgroundColor: darkMode ? "rgba(148,163,184,0.15)" : "#F1F5F9",
              color: darkMode ? "#E5E7EB" : "#334155",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {sorted.length}
          </span>
        </div>

        <div style={{ marginTop: 10, height: 4, width: 70, borderRadius: 999, backgroundColor: accent, opacity: 0.65 }} />
      </div>

      {/* List */}
<SortableContext items={sorted.map((t) => t.id)} strategy={verticalListSortingStrategy}>
  <div
    style={{
      padding: 16,
      display: "grid",
      flexDirection: "column",
      gap: 22,
      width: "100%",
      boxSizing: "border-box",
      overflow: "hidden",
      gridAutoRows: "max-content",
      rowGap: 24,
      minHeight: 260,
      backgroundColor: darkMode 
      ? "rgba(255,255,255,0.03)" 
      : "rgba(15,23,42,0.03)",
      borderRadius: 18,
    }}
  >
    {sorted.length === 0 ? (
      <div
        style={{
          border: `1px dashed ${border}`,
          borderRadius: 18,
          padding: 14,
          color: sub,
          fontSize: 13,
        }}
      >
        Drop tasks here
      </div>
    ) : (
      sorted.map((task, idx) => (
        <div 
        key={task.id}
        style={{ width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          marginBottom: idx === sorted.length - 1 ? 0 : 22,
         }}>
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          darkMode={darkMode}
        />
        </div>
      ))
    )}
  </div>
</SortableContext>
</div>
  );
}


{/*import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

export default function Column({ id, title, tasks, onDelete, onEdit, darkMode, sortBy }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const priorityRank = { High: 3, Medium: 2, Low: 1 };

  const sorted = [...tasks].sort((a, b) => {
    if (sortBy === "manual") return (a.order ?? 0) - (b.order ?? 0);

    if (sortBy === "title_asc")
      return (a.title ?? "").toLowerCase().localeCompare((b.title ?? "").toLowerCase());

    if (sortBy === "priority_desc")
      return (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0);

    const aTime = a.dueDate ? new Date(a.dueDate).getTime() : NaN;
    const bTime = b.dueDate ? new Date(b.dueDate).getTime() : NaN;

    const aVal = Number.isFinite(aTime) ? aTime : Infinity;
    const bVal = Number.isFinite(bTime) ? bTime : Infinity;

    if (sortBy === "due_asc") return aVal - bVal;
    if (sortBy === "due_desc") return bVal - aVal;

    return 0;
  });

  const accent =
    id === "todo"
      ? "bg-blue-500"
      : id === "inprogress"
      ? "bg-yellow-500"
      : id === "review"
      ? "bg-purple-500"
      : "bg-green-500";

  return (
    <div
      ref={setNodeRef}
      className={`rounded-3xl border shadow-sm transition-all duration-300
      hover:-translate-y-0.5 hover:shadow-2xl
      ${darkMode ? "border-gray-700 bg-gray-900/30 text-white" : "border-gray-200 bg-white/70 text-gray-900"}
      ${isOver ? "ring-2 ring-blue-400 shadow-2xl" : ""}`}
    >
      {/* Header 
      <div className={`px-5 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${accent}`} />
            <h2 className="text-base font-bold tracking-wide">{title}</h2>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold
            ${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"}`}
          >
            {sorted.length}
          </span>
        </div>

        <div className="mt-3 h-1 w-16 rounded-full" style={{ backgroundColor: "rgba(59,130,246,0.6)" }} />
      </div>

      {/* List 
      <SortableContext items={sorted.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="p-5 space-y-4 min-h-[260px]">
          {sorted.length === 0 ? (
            <div
              className={`rounded-2xl border border-dashed p-4 text-sm
              ${darkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-500"}`}
            >
              Drop tasks here
            </div>
          ) : (
            sorted.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
                darkMode={darkMode}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
} */}