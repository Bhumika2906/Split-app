import { useState } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { token } from "./api";
import { Landing, Auth, Invite, LandingDesktop } from "./pages/Public";
import LandingMobile from "./mobile/LandingMobile";
import Dashboard from "./pages/Dashboard";
import Group from "./pages/Group";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import VoiceSheet from "./components/VoiceSheet";

function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  const [voiceSheetMode, setVoiceSheetMode] = useState("add");
  const nav = useNavigate();

  if (!token()) return <Navigate to="/login" />;

  return (
    <div className="as-dash-layout">
      {/* Sidebar matching Picture 2 */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onVoiceClick={() => {
          setVoiceSheetMode("add");
          setVoiceSheetOpen(true);
        }}
        onVoiceQueryClick={() => {
          setVoiceSheetMode("query");
          setVoiceSheetOpen(true);
        }}
      />

      {/* Main Content Area matching Picture 1 */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Outlet context={{ onToggleSidebar: () => setSidebarOpen(!sidebarOpen) }} />
      </div>

      {/* Voice Assistant Sheet */}
      {voiceSheetOpen && (
        <VoiceSheet
          group={{ id: "g0", name: "Personal" }}
          mode={voiceSheetMode}
          onClose={() => setVoiceSheetOpen(false)}
          onSaved={() => setVoiceSheetOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/desktop" element={<LandingDesktop />} />
      <Route path="/mobile" element={<LandingMobile />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/signup" element={<Auth mode="signup" />} />
      <Route path="/invite/:t" element={<Invite />} />
      <Route path="/app" element={<Shell />}>
        <Route index element={<Dashboard />} />
        <Route path="groups/:id" element={<Group />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
