"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfilePageScreen from "@/components/profile/ProfilePageScreen";
import { usePanganita } from "@/context/PanganitaContext";

export default function ProfilPage() {
  const router = useRouter();
  const {
    profile,
    setScreen,
    updateFamilyCondition,
    toggleCommodity,
    addChild,
    removeChild,
    isLoggedIn,
    isAuthReady,
    showToast,
  } = usePanganita();

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      showToast(
        "Silakan masuk atau daftar akun terlebih dahulu untuk mengakses Profil Keluarga.",
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
    <ProfilePageScreen
      profile={profile}
      setScreen={setScreen}
      updateFamilyCondition={updateFamilyCondition}
      toggleCommodity={toggleCommodity}
      addChild={addChild}
      removeChild={removeChild}
    />
  );
}
