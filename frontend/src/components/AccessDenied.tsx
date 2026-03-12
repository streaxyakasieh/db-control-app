export default function AccessDenied() {
  return (
    <div className="card centered-card">
      <h2>Недостаточно прав</h2>
      <p className="muted">
        Этот раздел доступен только администраторам и модераторам.
      </p>
    </div>
  );
}