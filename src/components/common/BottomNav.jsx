import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { ASSETS } from "@/constants/assets";
import { ROUTES, PATH_TO_SCREEN } from "@/constants/routes";

export default function BottomNav({ active, setScreen }) {
  const router = useRouter();
  const pathname = usePathname();

  const currentActive =
    active || (pathname ? PATH_TO_SCREEN[pathname] : "home");

  const items = [
    {
      id: "home",
      icon: currentActive === "home" ? ASSETS.navHomeActive : ASSETS.navHomeInactive,
      label: "Beranda",
      targetScreen: "home",
    },
    {
      id: "scanner",
      icon: currentActive === "scanner" ? ASSETS.navScanner : ASSETS.navScanner,
      label: "Pindai",
      targetScreen: "scanner",
    },
    {
      id: "nita-chat",
      icon: currentActive === "nita-chat" ? ASSETS.navNitaActive : ASSETS.navNitaInactive,
      label: "Bu Nita",
      targetScreen: "nita-chat",
    },
    {
      id: "profile-page",
      icon: currentActive === "profile-page" ? ASSETS.navProfileActive : ASSETS.navProfileInactive,
      label: "Profil",
      targetScreen: "profile-page",
    },
  ];

  const handleClick = (targetScreen) => {
    if (setScreen) {
      setScreen(targetScreen);
    }
    const targetRoute = ROUTES[targetScreen] || "/beranda";
    if (pathname !== targetRoute.split("?")[0]) {
      router.push(targetRoute);
    }
  };

  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {items.map((item) => (
        <button
          className={currentActive === item.id ? "active" : ""}
          key={item.id}
          onClick={() => handleClick(item.targetScreen)}
        >
          <img src={item.icon} alt="" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
