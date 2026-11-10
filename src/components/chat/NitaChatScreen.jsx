"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/common/Logo";
import BottomNav from "@/components/common/BottomNav";
import { ASSETS, getAssetUrl } from "@/constants/assets";
import { usePanganita } from "@/context/PanganitaContext";

export default function NitaChatScreen({ setScreen, messages = [], onSendMessage }) {
  const router = useRouter();
  const { profile } = usePanganita();
  const [inputText, setInputText] = useState("");

  // State Perekaman Suara (Voice Note)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingMessageId, setPlayingMessageId] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const threadEndRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const transcribedTextRef = useRef("");

  const rawLoc = profile?.location?.trim() || "";
  const locCity = rawLoc ? rawLoc.split(",")?.[0]?.trim() : "";
  const city = locCity || profile?.city || "Kota Surakarta";

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isRecording]);

  // Bersihkan audio dan timer saat komponen unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  // Format detik ke MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 1. Mulai Perekaman Suara Riil + Transkripsi Suara (Speech to Text)
  // Kompatibel dengan semua browser: Chrome, Chrome Incognito, Firefox, Safari, Edge
  const handleStartRecording = async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        alert("Browser Ibu belum mendukung perekaman mikrofon langsung.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      transcribedTextRef.current = "";

      // Deteksi format audio paling kompatibel untuk browser saat ini (Firefox/Safari/Chrome)
      let mimeType = "audio/webm";
      if (typeof MediaRecorder !== "undefined" && typeof MediaRecorder.isTypeSupported === "function") {
        const preferredTypes = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
          "audio/ogg",
          "audio/mp4",
          "audio/wav",
        ];
        for (const t of preferredTypes) {
          if (MediaRecorder.isTypeSupported(t)) {
            mimeType = t;
            break;
          }
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Jalankan Speech Recognition jika didukung browser (aman dari crash di Incognito/Firefox)
      if (typeof window !== "undefined") {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          try {
            const recognition = new SpeechRecognition();
            recognition.lang = "id-ID";
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (e) => {
              let text = "";
              for (let i = 0; i < e.results.length; i++) {
                text += e.results[i][0].transcript + " ";
              }
              transcribedTextRef.current = text.trim();
            };

            recognition.onerror = (e) => {
              // Graceful error handling jika diblokir di Incognito/Firefox (rekaman audio tetap tersimpan)
              console.warn("Speech recognition notice (Audio tetap direkam):", e?.error);
            };

            speechRecognitionRef.current = recognition;
            try {
              recognition.start();
            } catch (startErr) {
              console.warn("Speech recognition start skipped:", startErr);
            }
          } catch (srErr) {
            console.warn("Speech recognition init warning:", srErr);
          }
        }
      }

      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Izin mikrofon gagal:", err);
      // Simulasi Voice Note jika di environment tanpa hardware mic
      const simulateVn = confirm(
        "Akses mikrofon tidak terdeteksi atau belum diizinkan. Apakah Ibu ingin mengirim simulasi Pesan Suara (Voice Note) dialek Papua untuk pengujian?"
      );
      if (simulateVn) {
        onSendMessage({
          text: "“Tong pu anak ini tra mau makan papeda sama ikan lele, badan lemas sekali, ada resep ka Bu Nita?”",
          voiceNote: {
            duration: "0:09",
            transcript: "Tong pu anak ini tra mau makan papeda sama ikan lele, badan lemas sekali, ada resep ka Bu Nita?",
            icon: "14e50.svg",
          },
        });
      }
    }
  };

  // 2. Berhenti & Kirim Voice Note (Dukungan Audio File Utuh untuk Browser Incognito/Firefox)
  const handleStopAndSendRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch {}
    }

    const recorder = mediaRecorderRef.current;
    const finalSeconds = Math.max(1, recordingSeconds);
    const spokenTranscript = transcribedTextRef.current ? transcribedTextRef.current.trim() : "";

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Konversi audio ke base64 agar dapat diproses oleh AI Pipeline backend / Gemini Multimodal
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result ? reader.result.split(",")[1] : "";
        const messageText = spokenTranscript
          ? `“${spokenTranscript}”`
          : `🎤 Pesan Suara Ibu (${formatTime(finalSeconds)})`;

        onSendMessage({
          text: messageText,
          audioBase64: base64Data,
          mimeType: recorder.mimeType || "audio/webm",
          voiceNote: {
            audioUrl,
            audioBase64: base64Data,
            mimeType: recorder.mimeType || "audio/webm",
            duration: formatTime(finalSeconds),
            transcript: spokenTranscript,
            icon: "14e50.svg",
          },
        });
      };
      reader.readAsDataURL(audioBlob);

      // Matikan audio tracks
      if (recorder.stream) {
        recorder.stream.getTracks().forEach((track) => track.stop());
      }
    };

    recorder.stop();
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  // 3. Batalkan Perekaman Suara
  const handleCancelRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch {}
    }

    if (mediaRecorderRef.current) {
      const recorder = mediaRecorderRef.current;
      recorder.onstop = null;
      if (recorder.state !== "inactive") recorder.stop();
      if (recorder.stream) {
        recorder.stream.getTracks().forEach((track) => track.stop());
      }
    }

    audioChunksRef.current = [];
    transcribedTextRef.current = "";
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  // 4. Putar Audio Voice Note (Player)
  const handleTogglePlayVoiceNote = (msg) => {
    if (playingMessageId === msg.id) {
      // Pause
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setPlayingMessageId(null);
      return;
    }

    // Stop pemutaran sebelumnya
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    // Jika ada file rekaman suara riil dari user (audioUrl)
    if (msg.voiceNote?.audioUrl) {
      const audio = new Audio(msg.voiceNote.audioUrl);
      audioPlayerRef.current = audio;
      setPlayingMessageId(msg.id);

      audio.onended = () => setPlayingMessageId(null);
      audio.onerror = () => setPlayingMessageId(null);
      audio.play().catch(() => setPlayingMessageId(null));
      return;
    }

    // Jika pesan suara dari Bu Nita (Text-to-Speech suara ramah keibuan, bebas robot)
    if ("speechSynthesis" in window && (msg.text || msg.sender === "nita")) {
      window.speechSynthesis.cancel();

      // Bersihkan dan normalkan teks untuk Text-to-Speech (TTS):
      // Hilangkan emoji, tanda petik, markdown bintang, baris rujukan & disclaimer
      // Normalkan akronim kapital (PANGANITA -> Panganita, MPASI -> empasi) agar engine Android (Google TTS)
      // dan Windows (Microsoft SAPI) tidak mengeja huruf per huruf (P-A-N-G-A-N-I-T-A)
      let cleanSpeechText = (msg.text || "")
        .replace(/“|”/g, "")
        .replace(/[*#_~`]/g, "")
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
        .replace(/📚.*$/gm, "")
        .replace(/⚠️.*$/gm, "")
        .replace(/\bPANGANITA\b/gi, "Panganita")
        .replace(/\bMPASI\b/gi, "empasi")
        .replace(/\b1\.000\s*HPK\b/gi, "seribu hari pertama kehidupan")
        .replace(/\bHPK\b/gi, "hari pertama kehidupan")
        .replace(/\s+/g, " ")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanSpeechText || "Halo Ibu, Bu Nita siap mendengarkan.");
      utterance.lang = "id-ID";

      // Pilih suara bahasa Indonesia alami (misal Damayanti, Google Bahasa Indonesia, atau Indonesian Female)
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().replace("_", "-").includes("id-id") ||
          v.lang.toLowerCase().includes("id") ||
          v.name.toLowerCase().includes("indonesia") ||
          v.name.toLowerCase().includes("damayanti") ||
          v.name.toLowerCase().includes("gadis")
      );
      if (idVoice) {
        utterance.voice = idVoice;
      }

      // Nada lebih hangat, keibuan (pitch 1.05) dan tempo tenang tidak terburu-buru (rate 0.94)
      utterance.pitch = 1.05;
      utterance.rate = 0.94;

      utterance.onstart = () => setPlayingMessageId(msg.id);
      utterance.onend = () => setPlayingMessageId(null);
      utterance.onerror = () => setPlayingMessageId(null);

      window.speechSynthesis.speak(utterance);
    } else {
      // Simulasi visual playing
      setPlayingMessageId(msg.id);
      setTimeout(() => setPlayingMessageId(null), 3000);
    }
  };

  // Kirim Pesan Teks
  const handleSubmitText = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleBack = () => {
    if (setScreen) setScreen("home");
    router.push("/beranda");
  };

  return (
    <main className="chat-page">
      <div className="chat-shell">
        <header className="chat-header">
          <button
            onClick={handleBack}
            aria-label="Kembali ke Beranda"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Logo compact />
          </button>
          <span>Aktif • Siap Mendengarkan Ibu</span>
        </header>

        <section className="chat-person">
          <img src={ASSETS.nitaAvatar} alt="Bu Nita AI" />
          <div>
            <h1>
              Bu Nita AI <span>Asisten Gizi RAG</span>
            </h1>
            <p>Panduan Pangan &amp; Gizi Keluarga • {city}</p>
          </div>
        </section>

        {/* THREAD PERCAKAPAN LINEAR VERTIKAL */}
        <div className="chat-thread">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            const isPlaying = playingMessageId === msg.id;

            // Jika pesan hanya kartu resep
            if (msg.recipeCard && !msg.text && !msg.voiceNote) {
              return (
                <article className="chat-recipe" key={msg.id}>
                  <span>{msg.recipeCard.tag}</span>
                  <h2>{msg.recipeCard.title}</h2>
                  <div>
                    <strong>Bahan Pokok Alami:</strong>
                    {msg.recipeCard.ingredients.map((ing, i) => (
                      <p key={i}>• {ing}</p>
                    ))}
                  </div>
                  <div>
                    <strong>Manfaat Penting:</strong>
                    <p>{msg.recipeCard.benefits}</p>
                  </div>
                  <button onClick={() => {
                    if (setScreen) setScreen("recipes");
                    router.push("/resep");
                  }}>
                    Dengarkan Langkah Memasak 🍲
                  </button>
                </article>
              );
            }

            return (
              <React.Fragment key={msg.id}>
                <div className={`message ${isUser ? "user" : "nita"}`}>
                  <small>
                    {isUser
                      ? `${msg.time} • ${msg.senderName}`
                      : `${msg.senderName} • ${msg.time}`}
                  </small>

                  {/* KARTU VOICE NOTE (AUDIO PLAYER) */}
                  {msg.voiceNote && (
                    <div
                      className="voice-message"
                      onClick={() => handleTogglePlayVoiceNote(msg)}
                      title="Klik untuk mendengarkan pesan suara"
                    >
                      <button
                        type="button"
                        className="voice-play-btn"
                        aria-label={isPlaying ? "Jeda suara" : "Putar suara"}
                      >
                        {isPlaying ? "⏸" : "▶"}
                      </button>

                      <div className="voice-waveform">
                        {[12, 18, 8, 22, 14, 20, 10, 16, 24, 12, 18, 9].map(
                          (h, idx) => (
                            <span
                              key={idx}
                              className={`waveform-bar ${isPlaying ? "active" : ""}`}
                              style={{
                                height: `${h}px`,
                                animationDelay: `${idx * 0.08}s`,
                              }}
                            />
                          )
                        )}
                      </div>

                      <span style={{ fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap" }}>
                        {isUser ? "Suara Ibu" : "Suara Bu Nita"} {msg.voiceNote.duration || "0:12"}
                      </span>
                    </div>
                  )}

                  {msg.text ? (
                    <div
                      style={{
                        margin: "6px 0 0",
                        whiteSpace: "pre-line",
                        lineHeight: "1.65",
                        fontSize: "14px",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                  ) : null}

                  {/* Lencana Indikator Dialek Terdeteksi */}
                  {msg.dialect?.isDialect && (
                    <div
                      style={{
                        marginTop: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        color: "#065f46",
                        fontWeight: "700",
                      }}
                    >
                      <span>🎯 Dialek Terdeteksi:</span>
                      <span>{msg.dialect.detected.join(", ")}</span>
                    </div>
                  )}
                </div>

                {/* Kartu Resep Pendukung (Jika Disertakan Bersama Pesan) */}
                {msg.recipeCard && (
                  <article className="chat-recipe">
                    <span>{msg.recipeCard.tag}</span>
                    <h2>{msg.recipeCard.title}</h2>
                    <div>
                      <strong>Bahan Pokok Alami:</strong>
                      {msg.recipeCard.ingredients.map((ing, i) => (
                        <p key={i}>• {ing}</p>
                      ))}
                    </div>
                    <div>
                      <strong>Manfaat Penting:</strong>
                      <p>{msg.recipeCard.benefits}</p>
                    </div>
                    <button onClick={() => {
                      if (setScreen) setScreen("recipes");
                      router.push("/resep");
                    }}>
                      Dengarkan Langkah Memasak 🍲
                    </button>
                  </article>
                )}
              </React.Fragment>
            );
          })}
          <div ref={threadEndRef} />
        </div>

        {/* DOCKED INPUT BAR (SEPERTI WHATSAPP DENGAN PEMBATAS BORDER ATAS) */}
        <div className="chat-dock">
          <div className="chat-dock-inner">
            {isRecording ? (
              /* Mode Merekam Suara Aktif */
              <div className="chat-recording-panel">
                <div className="chat-recording-indicator">
                  <span className="recording-dot" />
                  <span>Merekam Suara... ({formatTime(recordingSeconds)})</span>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    type="button"
                    className="chat-cancel-record-btn"
                    onClick={handleCancelRecording}
                    title="Batalkan rekaman"
                  >
                    ✕ Batal
                  </button>
                  <button
                    type="button"
                    className="chat-mic-btn recording"
                    onClick={handleStopAndSendRecording}
                    title="Kirim pesan suara"
                  >
                    <span style={{ fontSize: "16px" }}>➤</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Mode Ketik Teks & Tombol VN */
              <form
                onSubmit={handleSubmitText}
                style={{ display: "flex", width: "100%", alignItems: "center", gap: "10px" }}
              >
                <div className="chat-input-capsule">
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ketik pesan atau tekan mikrofon untuk rekam suara..."
                    aria-label="Ketik pesan konsultasi"
                  />
                </div>

                {inputText.trim() ? (
                  /* Tombol Kirim Teks */
                  <button
                    type="submit"
                    className="chat-mic-btn"
                    aria-label="Kirim pesan teks"
                    title="Kirim pesan"
                  >
                    <span style={{ fontSize: "16px" }}>➤</span>
                  </button>
                ) : (
                  /* Tombol Rekam Suara (Voice Note) */
                  <button
                    type="button"
                    className="chat-mic-btn"
                    onClick={handleStartRecording}
                    aria-label="Mulai rekam pesan suara"
                    title="Tekan untuk merekam pesan suara langsung"
                  >
                    <img
                      src={ASSETS.listenIcon || ASSETS.sendIcon}
                      alt="Pesan Suara"
                      style={{ width: "18px", height: "18px", filter: "brightness(0) invert(1)" }}
                    />
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
