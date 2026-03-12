import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: Props) {
  const { currentUser, refreshCurrentUser, refreshUsers } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [role, setRole] = useState("guest");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.display_name);
    }
  }, [currentUser]);

  if (!open || !currentUser) return null;

  const isAdmin = currentUser.role === "admin";
  const canCreate = isAdmin;

  const handleSaveProfile = async () => {
    try {
      await api.updateMe(currentUser.id, displayName);
      await refreshCurrentUser();
      setMessage("Имя профиля обновлено");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ошибка");
    }
  };

  const handleCreateUser = async () => {
    try {
      await api.createUser(currentUser.id, {
        username,
        display_name: newDisplayName,
        role
      });
      setUsername("");
      setNewDisplayName("");
      setRole("guest");
      setMessage("Профиль создан");
      await refreshUsers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ошибка");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Мой профиль</h2>
          <button className="btn btn-light" onClick={onClose}>
            Закрыть
          </button>
        </div>

        <div className="card">
          <h3>Текущий профиль</h3>
          <div className="grid-two">
            <div>
              <label className="label">Логин</label>
              <input className="input" value={currentUser.username} disabled />
            </div>
            <div>
              <label className="label">Роль</label>
              <input className="input" value={currentUser.role} disabled />
            </div>
          </div>

          <div>
            <label className="label">Имя</label>
            <input
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={handleSaveProfile}>
            Сохранить изменения
          </button>
        </div>

        <div className="card">
          <h3>Создание нового профиля</h3>
          <p className="muted">
            Только администратор может создавать профили с ролью admin, moderator или guest.
          </p>

          <div className="grid-two">
            <div>
              <label className="label">Логин</label>
              <input
                className="input"
                value={username}
                disabled={!canCreate}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Имя</label>
              <input
                className="input"
                value={newDisplayName}
                disabled={!canCreate}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Роль</label>
            <select
              className="select"
              value={role}
              disabled={!canCreate}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Администратор</option>
              <option value="moderator">Модератор</option>
              <option value="guest">Гость</option>
            </select>
          </div>

          <button
            className={canCreate ? "btn btn-primary" : "btn btn-disabled"}
            disabled={!canCreate}
            onClick={handleCreateUser}
          >
            Создать профиль
          </button>
        </div>

        {message && <div className="alert">{message}</div>}
      </div>
    </div>
  );
}