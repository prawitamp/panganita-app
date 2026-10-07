"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LocalFoodScreen from "@/components/food/LocalFoodScreen";
import { usePanganita } from "@/context/PanganitaContext";

export default function PanganLokalPage() {
  const router = useRouter();
  const { setScreen, isLoggedIn, isAuthReady, showToast } = usePanganita();

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      showToast(
        "Silakan masuk atau daftar akun terlebih dahulu untuk mengakses Ensiklopedia Gizi Lokal.",
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

  return <LocalFoodScreen setScreen={setScreen} />;
}
