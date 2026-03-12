export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={status === "ok" ? "badge badge-success" : "badge badge-error"}>
      {status}
    </span>
  );
}