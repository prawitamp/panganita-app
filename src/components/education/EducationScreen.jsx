import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DetailHeader from "@/components/common/DetailHeader";
import BottomNav from "@/components/common/BottomNav";
import { educationItems } from "@/data/educationItems";
import { ASSETS } from "@/constants/assets";

export default function EducationScreen({
  setScreen,
  playingAudioId,
  togglePlayAudio,
}) {
  const router = useRouter();
  const [topic, setTopic] = useState("Semua Topik");

  const topics = ["Semua Topik", "Balita Cegah Stunting", "Ibu Hamil & Janin"];

  const filteredItems = educationItems.filter((item) => {
    if (topic === "Semua Topik") return true;
    if (topic === "Balita Cegah Stunting") return item.category === "stunting";
    if (topic === "Ibu Hamil & Janin") return item.category === "pregnancy";
    return true;
  });

  const handleBack = () => {
    if (setScreen) setScreen("home");
    router.push("/beranda");
  };

  return (
    <main className="detail-page education-page">
      <div className="detail-shell">
        <DetailHeader
          title="Edukasi Gizi 1.000 HPK"
          subtitle="Panduan Audio Bu Nita"
          education
          back={handleBack}
        />

        <section className="voice-banner">
          <span className="voice-note">
            <img src={ASSETS.soundWave} alt="" />
          </span>
          <div>
            <p>
              <strong>SUARA NYATA</strong> Bebas Baca Rumit
            </p>
            <small>
              Sentuh tombol hijau pada setiap kartu untuk dengar penjelasan
              suara Bu Nita.
            </small>
          </div>
        </section>

        <div className="filter-row education-filter">
          {topics.map((item) => (
            <button
              className={topic === item ? "active" : ""}
              key={item}
              onClick={() => setTopic(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="education-heading">
          <strong>Audio Edukasi Bu Nita (3 Materi)</strong>
          <span>Mudah Dipahami</span>
        </div>

        <section className="education-grid">
          {filteredItems.map((item, index) => {
            const isPlaying = playingAudioId === index;
            return (
              <article className="education-card" key={item.title}>
                <div className="education-labels">
                  <span>
                    <img src={ASSETS.checkSmall} alt="" /> {item.label}
                  </span>
                  <span>{item.side}</span>
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="audio-player">
                  <button
                    className={isPlaying ? "playing" : ""}
                    onClick={() => togglePlayAudio(index)}
                    aria-label={
                      isPlaying ? "Jeda audio" : `Putar ${item.title}`
                    }
                  >
                    <img
                      src={isPlaying ? ASSETS.checkSmall : ASSETS.playButton}
                      alt=""
                    />
                  </button>
                  <div>
                    <strong>{item.voice}</strong>
                    <span className="wave-bars" aria-hidden="true">
                      {Array.from({ length: 10 }, (_, bar) => (
                        <i
                          key={bar}
                          style={
                            isPlaying
                              ? { animationPlayState: "running", opacity: 1 }
                              : { animationPlayState: "paused" }
                          }
                        />
                      ))}
                    </span>
                  </div>
                  <span>{item.duration}</span>
                </div>
                {item.takeaway ? (
                  <div className="takeaway">
                    <img src={ASSETS.listenIcon} alt="" /> {item.takeaway}
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        <aside className="consult-card">
          <img src={ASSETS.nitaAvatar} alt="Bu Nita" />
          <div>
            <strong>Bu Nita</strong>
            <span>Konselor Gizi Keluarga</span>
            <p>
              “Masih bingung dengan takaran ikan atau pola makan si kecil di
              rumah, Mama Nur?”
            </p>
          </div>
          <button onClick={() => setScreen("nita-chat")}>
            Konsultasi Gratis via Chat Bu Nita
            <img src={ASSETS.forwardGreenArrow} alt="" />
          </button>
        </aside>

        <BottomNav active={null} setScreen={setScreen} />
      </div>
    </main>
  );
}
