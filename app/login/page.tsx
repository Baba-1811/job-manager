"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: "20px"
    }}>
      <h1>就活管理アプリ</h1>
      <p>ログインして就活情報を管理しましょう</p>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        style={{
          padding: "12px 24px",
          backgroundColor: "#4285f4",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Googleでログイン
      </button>
    </div>
  );
}