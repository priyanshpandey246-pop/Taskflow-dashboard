import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./Column";

const STATUSES =["todo", "inprogress", "review", "done"];                                                                                         

export default function KanbanBoard({ tasks, setTasks, onDelete, onEdit, darkMode, sortBy})
{
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );
  const initOrders = (list) => {
    const  next = list.map((t) => ({...t}));
    STATUSES.forEach((status) => {
      const group = next.filter((t) => t.status === status);
      group.forEach((t, idx) => {
        if (t.order == null) t.order = idx;
      });
    });
    return next;
  };
console.log("Kanban DarkMode:",darkMode);

const normalizeOrders = (list, status) => {
  const group = list
  .filter((t) => t.status === status)
  .sort((a,b) => (a.order ?? 0) - (b.order ?? 0))
  .map((t, idx) => ({...t, order: idx}));

  const mapById = new Map(group.map((t) => [t.id, t]));
  return list.map((t) => (t.status === status ? mapById.get(t.id) : t));
};

  const handleDragEnd = ({active, over}) => {
    if (!over) return;
    if (active.id === over.id) return;
    setTasks((prev) => {
      let next = initOrders(prev);
      const activeTask = next.find((t) => t.id === active.id);
      if (!activeTask) return next;
      const overTask = next.find((t) => t.id === over.id);

      if(!overTask && STATUSES.includes(over.id)) {
        const newStatus = over.id;
        if (activeTask.status === newStatus) return next;
      
      const targetGroup = next
    .filter((t) => t.status === newStatus)
    .sort((a,b) => (a.order ?? 0) - (b.order ?? 0));
      const newOrder = targetGroup.length;

      next = next.map((t) => 
      t.id === active.id ? { ...t, status: newStatus, order: newOrder} : t
      );

      next = normalizeOrders(next, activeTask.status);
      next = normalizeOrders(next, newStatus);
      return next;
  }

  if (!overTask) return next;
  const oldStatus = activeTask.status;
  const newStatus = overTask.status;
  if (oldStatus !== newStatus) {
    next = next.map((t) => (t.id ===
      active.id ? {...t, status: newStatus} : t));
  }

  const group = next
  .filter((t) => t.status === newStatus)
  .sort((a,b) => (a.order ?? 0) - (b.order ?? 0));
  const from = group.findIndex((t) => t.id === active.id);
  const to = group.findIndex((t) => t.id === over.id);
  if (from === -1 || to === -1) return next;

  const moved = arrayMove(group, from, to).map((t, idx) => ({ ...t, order: idx}));
  const movedMap = new Map(moved.map((t) => [t.id, t]));
  next = next.map((t) => (t.status === newStatus ? movedMap.get(t.id) : t));
  if (oldStatus !== newStatus) {
    next = normalizeOrders(next, oldStatus);
  }
  return next;
  });
  };

  return (
    
    <DndContext sensors={sensors}
    collisionDetection={closestCenter} 
    onDragEnd={handleDragEnd}>
      <div style={{
        display: "grid",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}>

        <Column id="todo" title="To Do" tasks={tasks.filter(t => t.status === "todo")} onDelete={onDelete}  onEdit={onEdit} darkMode={darkMode} sortBy={sortBy}/>

        <Column id="inprogress" title="In Progress" tasks={tasks.filter(t => t.status === "inprogress")} onDelete={onDelete}  onEdit={onEdit} darkMode={darkMode} sortBy={sortBy}/>

        <Column id="review" title="Review" tasks={tasks.filter(t => t.status === "review")} onDelete={onDelete}  onEdit={onEdit} darkMode={darkMode} sortBy={sortBy}/>

        <Column id="done" title="Done" tasks={tasks.filter(t => t.status === "done")} onDelete={onDelete}  onEdit={onEdit} darkMode={darkMode} sortBy={sortBy}/>

      </div>
    </DndContext>
  );
}