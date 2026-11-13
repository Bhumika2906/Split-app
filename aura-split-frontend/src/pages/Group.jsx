import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { api } from "../api";
import GroupDesktop from "./GroupDesktop";
import GroupMobile from "../mobile/GroupMobile";

export default function Group() {
  const { id } = useParams();
  const outletCtx = useOutletContext();
  const onToggleSidebar = outletCtx?.onToggleSidebar;
  const [g, setG] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 700 : false
  );

  const load = () => api.group(id).then(setG);

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!g) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#64748b" }}>
        Loading group details…
      </div>
    );
  }

  return isMobile ? (
    <GroupMobile group={g} load={load} />
  ) : (
    <GroupDesktop group={g} load={load} onToggleSidebar={onToggleSidebar} />
  );
}
