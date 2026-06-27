import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import {Bar} from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TaskChart({darkMode}) {
    const data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [
            {
                label: "Task Completed",
                data: [5,8,6,10,7],
                backgroundColor: "#3B82F6",
            },
        ],
    };

    const textColor = darkMode ? "#E5E7EB" : "#374151";
    const mutedText = darkMode ? "#CBD5E1" : "#6B7280";
    const gridColor = darkMode ? "#334155" : "#E5E7EB";
    const tooltipBg = darkMode ? "#111827" : "#FFFFFF";
    const tooltipBorder = darkMode ? "#374151" : "#E5E7EB";

    const options ={ 
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend:{
                position: "bottom",
                labels: {
                    color: textColor,
                    font: { size: 12},
                },
            },
            title: {
                display: false,
                text: " Weekly Task Progress",
                color: textColor,
                font: { size: 16, weight: "bold" },
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
            x: {
                grid: { display: false},
                ticks: { color: mutedText},
            },
            y: {
                grid: { color: gridColor},
                ticks: { color: mutedText},
            },
        },
        animation: { 
            duration: 1000,
            easing: "easeOutQuart",
        },
    };
    return (
        <div style={{
           backgroundColor: darkMode ? "#1F2937" : "white",
            padding: "10px 20px 20px 20px",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            minHeight: "430px"
        }}
        >
            <h3 style={{
                marginTop: "0px",
                marginBottom: "10px" }}>
                Weekly Task Progress
            </h3>
            <div style = {{ 
                height: "380px",
                width: "100%",
                marginLeft: "0",
                marginTop: "-10px",
            }}>
            <Bar data={data} options={options} />
            </div>
        </div>
    );
}


export default TaskChart;