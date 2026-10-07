import React from "react";

export default function MaintenancePage() {
  return (
    <div
      style={{
        padding: "4rem 2rem",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7faf8",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ color: "#0d3829", fontSize: "32px", marginBottom: "16px" }}>
        Sedang Maintenance 🔧
      </h1>
      <p style={{ color: "#55625d", fontSize: "16px", maxWidth: "480px", lineHeight: "1.6" }}>
        Sistem PANGANITA sedang dalam peningkatan layanan server. Website akan kembali normal sebentar lagi.
      </p>
    </div>
  );
}
