"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePanganita } from "@/context/PanganitaContext";
import LandingScreen from "@/components/landing/LandingScreen";
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";
import ProfileSetupScreen from "@/components/onboarding/ProfileSetupScreen";
import HarvestSetupScreen from "@/components/onboarding/HarvestSetupScreen";
import HomeScreen from "@/components/home/HomeScreen";
import ScannerScreen from "@/components/scanner/ScannerScreen";
import LocalFoodScreen from "@/components/food/LocalFoodScreen";
import RecipesScreen from "@/components/recipes/RecipesScreen";
import EducationScreen from "@/components/education/EducationScreen";
import SimulatorScreen from "@/components/simulator/SimulatorScreen";
import DecisionResultScreen from "@/components/decision/DecisionResultScreen";
import ProfilePageScreen from "@/components/profile/ProfilePageScreen";
import NitaChatScreen from "@/components/chat/NitaChatScreen";

export default function PanganitaApp() {
  const router = useRouter();
  const {
    screen,
    setScreen,
    profile,
    setProfile,
    updateProfileData,
    updateFamilyCondition,
    toggleCommodity,
    addChild,
    removeChild,
    updateChild,
    detectedWeight,
    setDetectedWeight,
    harvestPrice,
    setHarvestPrice,
    harvestLocation,
    setHarvestLocation,
    decision,
    setDecision,
    chatMessages,
    sendUserMessage,
    playingAudioId,
    togglePlayAudio,
  } = usePanganita();

  useEffect(() => {
    if (screen === "home") {
      router.push("/beranda");
    } else if (screen === "simulator") {
      router.push("/simulator");
    } else if (screen === "scanner") {
      router.push("/scanner");
    } else if (screen === "local-food") {
      router.push("/pangan-lokal");
    } else if (screen === "recipes") {
      router.push("/resep");
    } else if (screen === "education") {
      router.push("/edukasi");
    } else if (screen === "nita-chat") {
      router.push("/bu-nita");
    } else if (screen === "profile-page") {
      router.push("/profil");
    }
  }, [screen, router]);

  switch (screen) {
    case "landing":
      return <LandingScreen setScreen={setScreen} />;

    case "welcome":
      return (
        <WelcomeScreen
          setScreen={setScreen}
          setProfile={setProfile}
          updateProfileData={updateProfileData}
          onNext={() => {
            setScreen("profile");
            router.push("/?step=profile");
          }}
          onBack={() => {
            setScreen("landing");
            router.push("/");
          }}
        />
      );

    case "profile":
      return (
        <ProfileSetupScreen
          setScreen={setScreen}
          profile={profile}
          setProfile={setProfile}
          updateProfileData={updateProfileData}
          onNext={() => {
            setScreen("harvest");
            router.push("/?step=harvest");
          }}
          onBack={() => {
            setScreen("welcome");
            router.push("/?step=welcome");
          }}
          addChild={addChild}
          removeChild={removeChild}
          updateChild={updateChild}
          initialSelected={profile.familyCondition}
          onSelectCondition={updateFamilyCondition}
        />
      );

    case "harvest":
      return (
        <HarvestSetupScreen
          setScreen={setScreen}
          onNext={() => {
            setScreen("home");
            router.push("/beranda");
          }}
          onBack={() => {
            setScreen("profile");
            router.push("/?step=profile");
          }}
          profile={profile}
          updateProfileData={updateProfileData}
          initialSelected={profile.commodities}
          onSelectHarvest={(commodities) => {
            updateProfileData({ commodities });
          }}
        />
      );

    case "scanner":
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

    case "local-food":
      return <LocalFoodScreen setScreen={setScreen} />;

    case "recipes":
      return <RecipesScreen setScreen={setScreen} />;

    case "education":
      return (
        <EducationScreen
          setScreen={setScreen}
          playingAudioId={playingAudioId}
          togglePlayAudio={togglePlayAudio}
        />
      );

    case "simulator":
      return (
        <SimulatorScreen
          setScreen={setScreen}
          choice={decision}
          setChoice={setDecision}
          weight={detectedWeight}
        />
      );

    case "decision-keep":
      return <DecisionResultScreen setScreen={setScreen} decision="keep" />;

    case "decision-sell":
      return <DecisionResultScreen setScreen={setScreen} decision="sell" />;

    case "profile-page":
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

    case "nita-chat":
      return (
        <NitaChatScreen
          setScreen={setScreen}
          messages={chatMessages}
          onSendMessage={sendUserMessage}
        />
      );

    case "home":
    default:
      return (
        <HomeScreen
          profile={profile}
          setScreen={setScreen}
          onAudioListen={() => setScreen("education")}
        />
      );
  }
}
