import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import TaskChart from "./components/TaskChart";
import KanbanBoard from "./components/KanbanBoard";
import React, { useEffect } from "react";
import TaskModal from "./components/TaskModal";
import TaskStatusChart from "./components/TaskStatusChart";
import { ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTaskStore } from "./store/useTaskStore";
import { FaMoon, FaSun } from "react-icons/fa"
function App() {
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const getInitialDarkMode = () => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  };
  const [darkMode, setDarkMode] = React.useState(getInitialDarkMode);
  const [assigneeFilter, setAssigneeFilter] = React.useState("All");
  const [tagsFilter, setTagFilter] = React.useState("All")
  const [sortBy, setSortBy] = React.useState("manual");
  const [priorityFilter, setPriorityFilter] = React.useState("All");

  const tasks = useTaskStore((s) => s.tasks);
  const setTasks = useTaskStore((s) => s.setTasks);
  const seedIfEmpty = useTaskStore((s) => s.seedIfEmpty);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const addComment = useTaskStore((s) => s.addComment);
  const deleteComment = useTaskStore((s) => s.deleteComment);
  const addSubtask = useTaskStore((s) => s.addSubtask);
  const toggleSubtask = useTaskStore((s) => s.toggleSubtask);
  const deleteSubtask = useTaskStore((s) => s.deleteSubtask);

  useEffect(() => {
    seedIfEmpty();
  }, [seedIfEmpty]);

  useEffect(() => {
   document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleAddTask = (newTask) => {
    addTask(newTask);
    toast.success(" Task Added Successfully");
  };

  const handleDeleteTask = (id) => {
   deleteTask(id);
    toast.error("Task Deleted");
  };

  const handleUpdateTask = (updatedTask) => {
    updateTask(updatedTask);
toast.info("Task Updated");
  };

  const makeId = () => 
  (crypto?.randomUUID && crypto.randomUUID()) || 
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const handleAddComment = (taskId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newComment = {
      id: makeId(),
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => 
    prev.map((task) =>
    task.id === taskId
  ? { ...task, comments: [...(task.comments ?? []), newComment]}
    : task
  )
);
toast.success("Comment Added");
  };

  const handleAddSubtask = (taskId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newSubtask = { id: makeId(), text: trimmed, done: false};
    setTasks((prev) => 
    prev.map((task) =>
    task.id === taskId
    ? {...task, subtasks: [...(task.subtasks ?? []), newSubtask] }
    : task
    )
    );
    toast.success("Subtask Added");
  };

  const handleToogleSubtask = (taskId, subtaskId) => {
    setTasks((prev) => 
    prev.map((task) => 
    task.id === taskId
  ? {
    ...task,
    subtasks: (task.subtasks ?? []).map((s) =>
    s.id === subtaskId ? {...s, done: !s.done} : s
  ),
  }
:task
)
);
  };

  const handleDeleteSubtask = (taskId, subtaskId) => {
    setTasks((prev) => 
    prev.map((task) => 
    task.id === taskId
  ? {...task, subtasks: (task.subtasks ?? []).filter((s) => s.id !== subtaskId)}
: task
)
);
toast.info("Subtask Deleted");
  };

  const handleDeleteComment = (taskId, commentId) => {
    setTasks((prev) => 
    prev.map((task)=>
    task.id === taskId ? {
      ...task,
      comments: (task.comments ?? []).filter((c) => c.id !==commentId),
    }
    :task
    )
    );

  toast.info("Comment Deleted");
  };


  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#0B1220" : "#F3F4F6";
    document.body.style.color = darkMode ? "#E5E7EB" : "#111827";
  }, [darkMode]);
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;
  const assigneeOptions = Array.from(new Set(tasks.map((t) => (t.assignee ?? "").trim()).filter(Boolean))
);
  const tagOptions = Array.from(new Set(tasks.flatMap((t) => t.tags ?? []).map((x) => String(x).trim()).filter(Boolean))
);
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesAssignee = assigneeFilter === "All" || (task.assignee ?? "") === assigneeFilter;
    const matchesTag = tagsFilter === "All" || (task.tags ?? []).includes(tagsFilter);
    return matchesSearch && matchesPriority && matchesStatus && matchesAssignee && matchesTag; 
  });

  const selectStyle = {
    width: "100%",
    maxWidth: "520px",
    padding: "14px",
   
    color: darkMode ? "white" : "black",
    backgroundColor: darkMode ? "#1F2937" : "white",
    borderRadius: "18px",
    border: `1px solid ${darkMode ? "#334155" : "#E5E7EB"}`,
    background: darkMode ? "rgba(17, 24,30,0.55)" : "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(8px)",
    boxShadow: darkMode
    ? "0 10px 30px rgba(0,0,0,0.35)"
    : "0 10px 30px rgba(0,0,0,0.08)"
  };

  const selectClass= {
    height: 44,
    padding: "0 14px",
    borderRadius: 14,
    border: `1px solid ${darkMode ? "#475569" : "#D1D5DB"}`,
    backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
    color: darkMode ? "#E5E7EB" : "#111827" ,outline: "none",
    borderColor: darkMode ? "#374151" : "#D1D5DB",
    borderRadius: "14px",
  };

  return (
    <div
  style={{
    minHeight: "100vh",
    display: "flex",         
    overflow: "hidden",
    backgroundColor: darkMode ? "#0F172A" : "#F3F4F6",
    color: darkMode ? "white" : "black",
  }}
>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

      {/* Main Content 
     <div className={`p-8 sm:p-6 md:p-8 flex-1 transition-colors duration-300 ${
     darkMode ? "bg-gray-900 text-white" : "" }`}> */}
        <div style={{ flex: 1,
          padding: "16px", 
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          minWidth: 0,
          boxSizing:"border-box",
        }}>
          <div 
          style={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
          }}>
        <Header
          onMenu={() => setSidebarOpen(true)}
          onNewTask={() => setIsModalOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          darkMode={darkMode}
        />

       <div className="mb-6 flex justify-center">
  <div className="w-full max-w-[520px] rounded-2xl p-4 bg-white/70 dark:bg-gray-900/40 backdrop-blur shadow-md">
   {/*} <div className="flex flex-col gap-6"> */}
   <div style={{display: "flex", flexDirection: "column", gap: "12px",}}>
     
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={selectStyle}
          className={`${selectClass} w-56`}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        
        <div style={{marginBottom: "12px"}}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
          className={`${selectClass} w-56`}
        >
          <option value="All">All Status</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>
      </div>

      {/* CENTER 
      <div style={{flex: 1, display: "flex", justifyContent: "center"}}> */}
      <div style={{marginBottom: "12px"}}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={selectStyle}
          className={`${selectClass} w-72`}
        >
          <option value="manual">Manual (Drag & Drop)</option>
          <option value="due_asc">Due Date: Nearest</option>
          <option value="due_desc">Due Date: Latest</option>
          <option value="priority_desc">Priority: High - low</option>
          <option value="title_asc">Title: A - Z</option>
        </select>
      </div>

      {/* RIGHT */}
      <div style={{display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "flex-end"}}>
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          style={selectStyle}
          className={`${selectClass} w-56`}
        >
          <option value="All">All Assignees</option>
          {assigneeOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={tagsFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          style={selectStyle}
          className={`${selectClass} w-56`}
        >
          <option value="All">All Tags</option>
          {tagOptions.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
     

    </div>
  </div>
</div>
       {/*} <div className="mb-6">
        <div className="mar-w-[1100px] mx-auto flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">TaskFlow Dashboard</h1>
        <button
  onClick={() => setDarkMode((prev) => !prev)}
  className={`mr-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold
  transition-all duration-200 border shadow-sm hover:shadow-lg active:scale-[0.98]
  focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    darkMode
      ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600 focus:ring-gray-500 focus:ring-offset-gray-900"
      : "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-white"
  }`}
>
  {darkMode ? <FaSun /> : <FaMoon />}
  {darkMode ? "Light Mode" : "Dark Mode"}
</button>
</div>
</div> */}

        <div style={{ marginBottom: 24 }}>
  <div
    style={{
      maxWidth: 1100,     
      margin: "0 auto",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 16,
    }}
  >
    <div
  id="dashboard"
  style={{
    maxWidth: 1100,
    marginLeft: 0,
    marginRight: "auto",
    marginTop: 18,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    textAlign: "left",
  }}
>
  <div style={{ textAlign: "left"}}>
    <div
      style={{
        fontSize: 20,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: 1000,
        color: darkMode ? "#93C5FD" : "#2563EB",
      }}
    >
      TaskFlow
    </div>

    <div
      style={{
        fontSize: 36,
        fontWeight: 900,
        marginTop: 6,
        lineHeight: 1.05,
        color: darkMode ? "#F8FAFC" : "#0F172A",
      }}
    >
      Dashboard
    </div>

    <div
      style={{
        marginTop: 10,
        opacity: 0.8,
        fontSize: 14,
        color: darkMode ? "#CBD5E1" : "#475569",
      }}
    >
      Track tasks, progress, and analytics in one place.
    </div>
  </div>

</div>

    <button
      onClick={() => setDarkMode((prev) => !prev)}
      style={{
        marginLeft: "auto",
        marginRight: 18,  
        padding: "10px 18px",
        borderRadius: 14,
        border: `1px solid ${darkMode ? "#4B5563" : "#1D4ED8"}`,
        backgroundColor: darkMode ? "#374151" : "#2563EB",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 700,
        boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.25)";
        e.currentTarget.style.backgroundColor = darkMode ? "#4B5563" : "#1D4ED8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.18)";
        e.currentTarget.style.backgroundColor = darkMode ? "#374151" : "#2563EB";
      }}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  </div>
</div>

        {/* Stat Cards */}
        <h1 className="text-red-500 text-5xl">Test</h1>
        <div style ={{display: "grid",
            gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px", 
            marginBottom: "50px"}}>
        {/*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-4 border-red-500">*/}
          <StatCard title="Total Tasks" value={tasks.length} darkMode={darkMode} />
          <StatCard title="Completed" value={tasks.filter((task) => task.status === "done").length} darkMode={darkMode}/>
          <StatCard title="In Progress" value={tasks.filter((task) => task.status === "inprogress").length } darkMode={darkMode} />
          <StatCard title="To Do" value={tasks.filter((task) => task.status === "todo").length} darkMode={darkMode}/>
        </div>

        <div id = "analytics">
          <div className="charts-container">
  <div className="chart-item">
    <TaskChart darkMode={darkMode} />
  </div>

  <div className="chart-item">
    <TaskStatusChart tasks={tasks} darkMode={darkMode} />
  </div>
</div>
</div>
        {/* Charts 
        <div style={{display: "flex",
           gap: 24, 
           gridTemplateColumns: "repeat(auto-fit, minmax(350px,1fr))", 
           marginTop: 24,
           width: "100%",
           }}>
          <div style={{ flex: "1 1 450px", minWidth: "350px",}}>
    <TaskChart darkMode={darkMode} />
  </div>

  <div style={{ flex: "1 1 450px", minWidth: "350px",}}>
    <TaskStatusChart tasks={tasks} darkMode={darkMode} />
  </div>
</div>
</div> */}

        <div className="my-10 border-t border-gray-300 dark:border-gray-700"></div>

        <div className="mb-6">
          <p className="font-semibold mb-2">
            Completed: {completedTasks} / {tasks.length} Tasks
          </p>
          <div className="w-full bg-gray-300 rounded-full h-4">
            <div className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progress}%`}}></div>
          </div>
        </div>

        <h2 id="kanban" style={{ fontSize: 22, fontWeight: 800}}>
          Project Board
        </h2>

       <div 
       style={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
       }}
       >

        {/* Kanban Board */}
        <KanbanBoard
          tasks={filteredTasks}
          setTasks={setTasks}
          onDelete={handleDeleteTask}
          darkMode={darkMode}
          sortBy={sortBy}
          onEdit={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
        />
        </div>

        <div id="settings" style={{ marginTop: 40 }}>
  <div
    style={{
      padding: 18,
      borderRadius: 18,
      border: `1px solid ${darkMode ? "#334155" : "#E5E7EB"}`,
      background: darkMode ? "rgba(15,23,42,0.35)" : "rgba(255,255,255,0.7)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      maxWidth: "100%",
    }}
  >
    


        <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, marginBottom: 20 }}>
      Settings
    </h2>
    <p style={{ margin: 0, opacity: 0.75 }}>
      Coming soon...
    </p>

      </div>
</div>

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false);
            setEditingTask(null);
          }}
          onAddTask={handleAddTask}
          editingTask={editingTask ? tasks.find((t) => t.id === editingTask.id) : null}
          onUpdateTask={handleUpdateTask}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onAddSubtask={handleAddSubtask}
          onToggleSubtask={handleToogleSubtask}
          onDeleteSubtask={handleDeleteSubtask}
          darkMode={darkMode}
        />

        <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        />
      </div>
    </div>
    </div>
  );
}

export default App;