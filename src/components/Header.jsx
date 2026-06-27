import React from "react";
import { FiMenu } from "react-icons/fi";
function Header({
    onNewTask,
    searchTerm,
    setSearchTerm,
    darkMode,
    onMenu
}){
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    
    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginBottom: "30px",
        }}
        >
            <input type="text" 
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) =>
                setSearchTerm(e.target.value)
            }
            style={{
                padding: "12px 16px",
                width: "100%",
                maxWidth: "280px",
                flex: 1,
                borderRadius: "12px",
                backgroundColor: darkMode ?
                "#1F2937" : "white",
                color: darkMode ? "white" : "black",
                border: darkMode
                ? "1px solid #374151"
                : "1px solid #D1D5DB",
                outline: "none",
                fontSize: "14px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)" 
            }}
            />

            <button onClick = {onNewTask}
            style={{
                padding: "12px 20px",
                backgroundColor: "#3B82F6",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)"
            }}
            >
                + New Task
            </button>
             
             {isMobile && (

                 <button
                 onClick={onMenu}
                 style={{ padding: 10, 
                    borderRadius: 12, 
                    border: "1px solid #334155", 
                    background: "transparent", 
                    cursor: "pointer"
                 }}
                 >
                     <FiMenu size={20}/>
                     
                 </button>
                 )}
             </div>
         );
     }
             

export default Header;