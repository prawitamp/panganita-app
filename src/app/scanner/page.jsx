"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ScannerScreen from "@/components/scanner/ScannerScreen";
import { usePanganita } from "@/context/PanganitaContext";

export default function ScannerPage() {
  const router = useRouter();
  const {
    setScreen,
    detectedWeight,
    setDetectedWeight,
    harvestPrice,
    setHarvestPrice,
    harvestLocation,
    setHarvestLocation,
    isLoggedIn,
    isAuthReady,
    showToast,
  } = usePanganita();

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      showToast(
        "Silakan masuk atau daftar akun terlebih dahulu untuk menggunakan Pindai Panen.",
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
    <ScannerScreen
      setScreen={setScreen}
      weight={detectedWeight}
      setWeight={setDetectedWeight}
      price={harvestPrice}
      setPrice={setHarvestPrice}
      location={harvestLocation}
      setLocation={setHarvestLocation}
    />
  );
}
