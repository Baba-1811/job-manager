"use client";

import { useSettings, getSettingsClasses } from "../contexts/SettingsContext";

export default function SettingsWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const { fontSizeClass, fontFamilyClass } = getSettingsClasses(settings);

  return (
    <div className={`${fontSizeClass} ${fontFamilyClass}`}>
      {children}
    </div>
  );
}