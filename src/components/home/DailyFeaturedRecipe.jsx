import React from "react";
import { ASSETS } from "@/constants/assets";

export default function DailyFeaturedRecipe({ onAudioListen }) {
  return (
    <section className="recipe-card" id="resep">
      <div className="recipe-labels">
        <strong>RESEP LOKAL UNGGULAN HARI INI</strong>
        <span>MPASI 9–11 Bln</span>
      </div>
      <img
        className="recipe-image"
        src={ASSETS.recipePapeda}
        alt="Papeda ikan kuah kuning MPASI"
      />
      <div className="recipe-meta">
        <span>20 Menit</span>
        <span>Kaya DHA &amp; Omega-3</span>
      </div>
      <h2>Papeda Ikan Kuah Kuning MPASI</h2>
      <p>
        Tekstur lembut kaya protein hewani untuk tumbuh kembang optimal si
        kecil.
      </p>
      <button className="audio-button" onClick={onAudioListen}>
        Dengarkan Cara Masak (Audio)
      </button>
    </section>
  );
}
