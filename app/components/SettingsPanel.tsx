"use client";

import { useSettings, getSettingsClasses } from "../contexts/SettingsContext";

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useSettings();
  const { themeColorClass } = getSettingsClasses(settings);

  return (
    <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border bg-white shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base">表示設定</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-black text-lg">✕</button>
      </div>

      {/* 文字の大きさ */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">文字の大きさ</label>
        <div className="flex gap-2">
          {(["small", "medium", "large"] as const).map((size) => (
            <button
              key={size}
              onClick={() => updateSettings({ fontSize: size })}
              className={`flex-1 rounded-md border py-2 text-sm transition-colors ${
                settings.fontSize === size
                  ? `${themeColorClass} text-white border-transparent`
                  : "hover:bg-gray-50"
              }`}
            >
              {{ small: "小", medium: "中", large: "大" }[size]}
            </button>
          ))}
        </div>
      </div>

      {/* テーマカラー */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">テーマカラー</label>
        <div className="flex gap-3">
          {(["black", "blue", "green", "rose"] as const).map((color) => {
            const bgClass = {
              black: "bg-black",
              blue: "bg-blue-600",
              green: "bg-green-600",
              rose: "bg-rose-600",
            }[color];
            return (
              <button
                key={color}
                onClick={() => updateSettings({ themeColor: color })}
                className={`w-9 h-9 rounded-full ${bgClass} transition-transform ${
                  settings.themeColor === color
                    ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                    : "hover:scale-105"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* フォント */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">フォント</label>
        <div className="flex gap-2">
          {(["sans", "serif", "mono"] as const).map((font) => (
            <button
              key={font}
              onClick={() => updateSettings({ fontFamily: font })}
              className={`flex-1 rounded-md border py-2 text-sm transition-colors ${
                settings.fontFamily === font
                  ? `${themeColorClass} text-white border-transparent`
                  : "hover:bg-gray-50"
              }`}
            >
              {{ sans: "ゴシック", serif: "明朝", mono: "等幅" }[font]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}