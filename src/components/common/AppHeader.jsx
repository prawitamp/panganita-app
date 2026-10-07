import React from "react";
import Navbar from "./Navbar";
import { usePanganita } from "@/context/PanganitaContext";

export default function AppHeader() {
  const { screen, setScreen, profile } = usePanganita();

  return (
    <Navbar
      activeScreen={screen}
      setScreen={setScreen}
      profile={profile}
    />
  );
}
