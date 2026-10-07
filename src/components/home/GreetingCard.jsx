import React from "react";
import { ASSETS } from "@/constants/assets";

export default function GreetingCard({ name, avatar, location, onVoiceHelp }) {
  return (
    <div className="greeting-card">
      <img src={avatar || ASSETS.mamaNurAvatar} alt={name || "Foto Ibu"} />
      <div>
        <h1>Halo, {name || "Ibu"}!</h1>
        <p>{location}</p>
      </div>
      <button onClick={onVoiceHelp}>Bantuan Suara</button>
    </div>
  );
}
