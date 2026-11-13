import React, { useState, useEffect } from "react";
import SettingsDesktop from "./SettingsDesktop";
import SettingsMobile from "../mobile/SettingsMobile";

export default function Settings() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 700 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <SettingsMobile /> : <SettingsDesktop />;
}

