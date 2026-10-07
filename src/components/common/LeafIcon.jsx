import React from "react";
import { ASSETS } from "@/constants/assets";

export default function LeafIcon() {
  return (
    <span className="leaf-icon" aria-hidden="true">
      <img src={ASSETS.leafIcon} alt="" />
    </span>
  );
}
