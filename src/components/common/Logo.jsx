import React from "react";
import { ASSETS } from "@/constants/assets";

export default function Logo({ compact = false }) {
  return (
    <img
      className={compact ? "h-9 w-auto" : "h-14 w-auto"}
      src={ASSETS.logo}
      alt="Panganita — Pangan dan Gizi untuk Keluarga"
    />
  );
}
