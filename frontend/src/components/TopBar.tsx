import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ProfileModal from "./ProfileModal";

export default function TopBar() {
  const { users, currentUser, setCurrentUserId } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    if (!isNaN(id)) {
      setCurrentUserId(id);
    }
  };

  return (
    <header className="topbar">

      <div className="topbar-title">
        DB Control Panel
      </div>

      <div className="topbar-actions">

        <select
          className="select"
          value={currentUser?.id ?? ""}
          onChange={handleChange}
        >
          {users.length === 0 && (
            <option value="">Загрузка...</option>
          )}

          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.display_name} ({u.role})
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary"
          onClick={() => setProfileOpen(true)}
        >
          Мой профиль
        </button>

      </div>

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

    </header>
  );
}