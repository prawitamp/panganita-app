import React from "react";
import { ASSETS } from "@/constants/assets";
import { usePanganita } from "@/context/PanganitaContext";

export default function DetailHeader({
  title,
  subtitle,
  back,
  education = false,
}) {
  const { profile } = usePanganita();
  const avatarSrc = profile?.avatar || ASSETS.mamaNurAvatar;
  const displayName = profile?.name || "Ibu";

  return (
    <header className="detail-header">
      <button className="detail-back" onClick={back} aria-label="Kembali">
        <img src={ASSETS.backChevron} alt="" />
      </button>
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {education ? (
        <span className="midwife-online">
          <i /> Bu Nita Aktif
        </span>
      ) : (
        <div className="detail-actions">
          <img src={ASSETS.soundWave} alt="" />
          <img
            className="detail-avatar"
            src={avatarSrc}
            alt={displayName}
          />
        </div>
      )}
    </header>
  );
}
