import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ProfileModal from "./ProfileModal";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <TopBar onOpenProfile={() => setProfileOpen(true)} />
        <main className="page-content">{children}</main>
      </div>
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}