import React from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/common/AppHeader";
import BottomNav from "@/components/common/BottomNav";
import GreetingCard from "./GreetingCard";
import HpkBanner from "./HpkBanner";
import FeatureGrid from "./FeatureGrid";
import DailyFeaturedRecipe from "./DailyFeaturedRecipe";
import { ROUTES } from "@/constants/routes";

export default function HomeScreen({ profile, setScreen, onAudioListen }) {
  const router = useRouter();

  const rawLoc = profile?.location?.trim() || "";
  const locCity = rawLoc ? rawLoc.split(",")?.[0]?.trim() : "";
  const locProvince =
    rawLoc && rawLoc.includes(",")
      ? rawLoc.split(",")?.slice(1)?.join(",")?.trim()
      : "";

  const city = locCity || profile?.city || "Kab. Pandeglang";
  const province = locProvince || profile?.province || "Banten";
  const displayLocation = `${city} • ${province}`;

  const handleNavigate = (target) => {
    if (setScreen) {
      setScreen(target);
    }
    const targetRoute = ROUTES[target] || "/beranda";
    router.push(targetRoute);
  };

  return (
    <div className="app-page">
      <AppHeader />
      <main className="app-shell" style={{ paddingTop: "20px" }}>
        <div className="dashboard-grid">
          <section className="dashboard-main">
            <GreetingCard
              name={profile?.name || "Ibu"}
              avatar={profile?.avatar}
              location={displayLocation}
              onVoiceHelp={() => handleNavigate("nita-chat")}
            />

            <HpkBanner onLearnMore={() => handleNavigate("education")} />

            <FeatureGrid onSelectFeature={(target) => handleNavigate(target)} />
          </section>

          <DailyFeaturedRecipe onAudioListen={onAudioListen} />
        </div>
        <BottomNav active="home" setScreen={handleNavigate} />
      </main>
    </div>
  );
}
