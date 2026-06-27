function StatCard({ title, value, darkMode }) {
  return (
    <div
      style={{
        backgroundColor: darkMode ? "#1F2937" : "white",
        color: darkMode ? "white" : "black",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",

        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          color: "#6b7280",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      <h2
        style={{
          margin: 0,
          fontSize: "32px",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default StatCard;