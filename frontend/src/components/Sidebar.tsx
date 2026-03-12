import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Главная" },
  { to: "/databases", label: "Базы данных" },
  { to: "/logs", label: "Логи" }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">DB</div>
        <div>
          <div className="brand-title">DB Control</div>
        </div>
      </div>

      <nav className="nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}