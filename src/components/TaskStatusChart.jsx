import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function TaskStatusChart({ tasks, darkMode }) {
  const todo = tasks.filter((task) => task.status === "todo").length;
  const inprogress = tasks.filter((task) => task.status === "inprogress").length;
  const review = tasks.filter((task) => task.status === "review").length;
  const done = tasks.filter((task) => task.status === "done").length;

  const textColor = darkMode ? "#E5E7EB" : "#374151";
  const tooltipBg = darkMode ? "#111827" : "#FFFFFF";
  const tooltipBorder = darkMode ? "#374151" : "#E5E7EB";

  const data = {
    labels: ["To Do", "In Progress", "Review", "Done"],
    datasets: [
      {
        data: [todo, inprogress, review, done],
        backgroundColor: ["#3B82F6", "#F59E0B", "#8B5CF6", "#10B981"],
        borderColor: darkMode ? "#111827" : "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 25,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          font: { size: window.innerWidth < 768 ? 10 : 12 ,},
          boxWidth: window.innerWidth < 768 ? 12 : 18,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        titleColor: textColor,
        bodyColor: textColor,
      },
    },
    scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: textColor,
      },
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
    },
    x: {
      ticks: {
        color: textColor,
      },
      grid: {
        display: false,
      },
    },
  },
};
   
      

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#1F2937" : "white",
        color: darkMode ? "#E5E7EB" : "#111827",
        padding: "20px",
        borderRadius: "20px",
        paddingBottom: "40px",
        width: "100%",
        minHeight: "350px",
        overflow: "hidden",
        boxSizing: "border-box",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Task Status Distribution</h3>
       
       <div style={{
        width: "100%", 
        maxWidth: "300px", 
        overflow: "hidden",
        marginBottom: "15px",
        height: window.innerWidth < 768 ? "260px" : "320px",
        margin: "0 auto 20px",
        position: "relative",
        }}
        >
      <Pie data={data} options={options} />
    </div>
    </div>
  );
}

export default TaskStatusChart;