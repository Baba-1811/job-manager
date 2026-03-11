"use client";

import { createContext, useContext, useEffect, useState } from "react";

type FontSize = "small" | "medium" | "large";
type ThemeColor = "black" | "blue" | "green" | "rose";
type FontFamily = "sans" | "serif" | "mono";

type Settings = {
  fontSize: FontSize;
  themeColor: ThemeColor;
  fontFamily: FontFamily;
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

const defaultSettings: Settings = {
  fontSize: "medium",
  themeColor: "black",
  fontFamily: "sans",
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // LocalStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("app-settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("app-settings", JSON.stringify(updated));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);

// 設定値をTailwindクラスに変換するヘルパー
export function getSettingsClasses(settings: Settings) {
  const fontSizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[settings.fontSize];

  const themeColorClass = {
    black: "bg-black",
    blue: "bg-blue-600",
    green: "bg-green-600",
    rose: "bg-rose-600",
  }[settings.themeColor];

  const fontFamilyClass = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  }[settings.fontFamily];

  return { fontSizeClass, themeColorClass, fontFamilyClass };
}