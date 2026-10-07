// Mapping rute URL Next.js App Router dan screen identifier Panganita

export const ROUTES = {
  landing: "/",
  welcome: "/?step=welcome",
  profile: "/?step=profile",
  harvest: "/?step=harvest",
  home: "/beranda",
  simulator: "/simulator",
  scanner: "/scanner",
  "local-food": "/pangan-lokal",
  recipes: "/resep",
  education: "/edukasi",
  "nita-chat": "/bu-nita",
  "profile-page": "/profil",
  "decision-keep": "/simulator?keputusan=keep",
  "decision-sell": "/simulator?keputusan=sell",
};

export const PATH_TO_SCREEN = {
  "/": "landing",
  "/beranda": "home",
  "/simulator": "simulator",
  "/scanner": "scanner",
  "/pangan-lokal": "local-food",
  "/resep": "recipes",
  "/edukasi": "education",
  "/bu-nita": "nita-chat",
  "/profil": "profile-page",
};
