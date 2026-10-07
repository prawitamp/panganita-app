"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import NitaChatScreen from "@/components/chat/NitaChatScreen";
import { usePanganita } from "@/context/PanganitaContext";

export default function BuNitaPage() {
  const router = useRouter();
  const { setScreen, chatMessages, sendUserMessage, isLoggedIn, isAuthReady, showToast } =
    usePanganita();

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      showToast(
        "Silakan masuk atau daftar akun terlebih dahulu untuk berkonsultasi dengan Bu Nita.",
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
    <NitaChatScreen
      setScreen={setScreen}
      messages={chatMessages}
      onSendMessage={sendUserMessage}
    />
  );
}
