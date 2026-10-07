"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeScreen from "@/components/home/HomeScreen";
import { usePanganita } from "@/context/PanganitaContext";

export default function BerandaPage() {
  const router = useRouter();
  const { profile, setScreen, isLoggedIn, isAuthReady, showToast } = usePanganita();

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      showToast(
        "Silakan masuk atau daftar akun terlebih dahulu untuk mengakses Beranda.",
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
    <HomeScreen
      profile={profile}
      setScreen={setScreen}
      onAudioListen={() => setScreen("education")}
    />
  );
}
