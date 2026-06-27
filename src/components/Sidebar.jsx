import { useEffect, useState } from "react";

export default function Sidebar({isOpen, onClose}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "kanban", label: "Kanban Board" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ];

  const [active, setActive] = useState("dashboard");
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setActive(hash);
  }, []);

  const goTo = (id) => {
    setActive(id);
    window.location.hash = id;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sidebarStyle = {
    width: 240,
    minHeight: "100vh",
    backgroundColor: "#111827",
    color: "white",
    padding: "30px 20px",
    boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 60,
    transform: isOpen ? "translateX(0)" : "translateX(-110%)",
    transition: "transform 0.2s ease",
  };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      if (mq.matches) {
        // desktop pe open state irrelevant
      }
    };
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
   const isDesktop = window.innerWidth >= 768;

   return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 55,
          }}
        />
      )}

      
     

<div
  style={{
    ...sidebarStyle,
    ...(isDesktop
      ? {
          position: "sticky",
          transform: "translateX(0)",
          zIndex: 1,
          flexShrink: 0,
        }
      : {}),
  }}
>
       {/*<div
        style={{
          ...sidebarStyle,
          ...(window.matchMedia?.("(min-width: 768px)")?.matches
            ? { position: "sticky", transform: "translateX(0)", zIndex: 1 }
            : {}),
        }}
      > */}
         <h2
          style={{
            marginBottom: 50,
            fontSize: 28,
            fontWeight: "bold",
            color: "#60A5FA",
          }}
        >
          TaskFlow
        </h2>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const isActive = active === item.id;
            const isHover = hovered === item.id;

            return (
              <li
                key={item.id}
                onClick={() => goTo(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  margin: "12px 0",
                  padding: "12px 16px",
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive
                    ? "rgba(96,165,250,0.18)"
                    : isHover
                    ? "#374151"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(96,165,250,0.35)"
                    : "1px solid transparent",
                  transform: isHover ? "translateX(5px)" : "translateX(0)",
                  userSelect: "none",
                }}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}


 {/* return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        backgroundColor: "#111827",
        color: "white",
        padding: "30px 20px",
        boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo 
      <h2
        style={{
          marginBottom: "50px",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#60A5FA",
        }}
      >
        TaskFlow
      </h2>

      {/* Menu 
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menuItems.map((item) => {
          const isActive = active === item.id;
          const isHover = hovered === item.id;

          return (
            <li
              key={item.id}
              onClick={() => goTo(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                margin: "12px 0",
                padding: "12px 16px",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: isActive
                  ? "rgba(96,165,250,0.18)"
                  : isHover
                  ? "#374151"
                  : "transparent",
                border: isActive ? "1px solid rgba(96,165,250,0.35)" : "1px solid transparent",
                transform: isHover ? "translateX(5px)" : "translateX(0)",
                userSelect: "none",
              }}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar; */}