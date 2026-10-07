"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import RecipesScreen from "@/components/recipes/RecipesScreen";
import { usePanganita } from "@/context/PanganitaContext";

export default function ResepPage() {
  const router = useRouter();
  const { setScreen, isLoggedIn, isAuthReady, showToast } = usePanganita();

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      showToast(
        "Silakan masuk atau daftar akun terlebih dahulu untuk mengakses Resep MPASI & Olahan Panen.",
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

  return <RecipesScreen setScreen={setScreen} />;
}
