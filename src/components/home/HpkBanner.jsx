import React from "react";
import { ASSETS } from "@/constants/assets";

export default function HpkBanner({ onLearnMore }) {
  return (
    <article className="hpk-banner">
      <div>
        <span>PENTING UNTUK 1000 HPK</span>
        <h2>Manfaatkan Pangan di Sekitarmu, Lawan Stunting Sejak 1000 HPK</h2>
        <a
          href="#resep"
          onClick={(e) => {
            if (onLearnMore) {
              e.preventDefault();
              onLearnMore();
            }
          }}
        >
          Pelajari Gizi 1000 HPK
        </a>
      </div>
      <img src={ASSETS.childFishBanner} alt="Anak membawa hasil ikan" />
    </article>
  );
}
