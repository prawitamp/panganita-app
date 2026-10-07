"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SimulatorScreen from "@/components/simulator/SimulatorScreen";
import DecisionResultScreen from "@/components/decision/DecisionResultScreen";
import { usePanganita } from "@/context/PanganitaContext";

function SimulatorContent() {
  const router = useRouter();
  const {
    setScreen,
    decision,
    setDecision,
    detectedWeight,
    screen,
    isLoggedIn,
    isAuthReady,
    showToast,
  } = usePanganita();
  const searchParams = useSearchParams();
  const keputusanParam = searchParams ? searchParams.get("keputusan") : null;

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      showToast(
        "Silakan masuk atau daftar akun terlebih dahulu untuk menggunakan Simulator Panen & Gizi.",
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

  if (screen === "decision-keep" || keputusanParam === "keep") {
    return <DecisionResultScreen setScreen={setScreen} decision="keep" />;
  }

  if (screen === "decision-sell" || keputusanParam === "sell") {
    return <DecisionResultScreen setScreen={setScreen} decision="sell" />;
  }

  return (
    <SimulatorScreen
      setScreen={setScreen}
      choice={decision}
      setChoice={setDecision}
      weight={detectedWeight}
    />
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="loading-state">Memuat Simulator...</div>}>
      <SimulatorContent />
    </Suspense>
  );
}
