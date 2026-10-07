"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import EducationScreen from "@/components/education/EducationScreen";
import { usePanganita } from "@/context/PanganitaContext";

export default function EdukasiPage() {
  const router = useRouter();
  const { setScreen, playingAudioId, togglePlayAudio, isLoggedIn, isAuthReady, showToast } =
    usePanganita();

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      showToast(
        "Silakan masuk atau daftar akun terlebih dahulu untuk mendengarkan Panduan Suara 1.000 HPK.",
        "warning",
        "Akses Terbatas"
      );
      if (setScreen) setScreen("welcome");
      router.push("/?step=welcome");
    }
  }, [isAuthReady, isLoggedIn, router, setScreen, showToast]);

  if (!isAuthReady || !isLoggedIn) {
    return null;
  }

  return (
    <EducationScreen
      setScreen={setScreen}
      playingAudioId={playingAudioId}
      togglePlayAudio={togglePlayAudio}
    />
  );
}
