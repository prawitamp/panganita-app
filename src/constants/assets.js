/**
 * Asset paths helper untuk aplikasi Panganita
 * Menghubungkan seluruh icon SVG dan foto ilustrasi dari folder public/assets
 */

export const ASSET_DIR = "/assets/";

export function getAssetUrl(filename) {
  if (filename && filename.startsWith("/")) {
    return filename;
  }
  return `${ASSET_DIR}${filename}`;
}

export const ASSETS = {
  // Logo & Identitas
  logo: getAssetUrl("05781.png"),
  leafIcon: getAssetUrl("b547c.svg"),
  whatsappIcon: getAssetUrl("2dea2.svg"),
  securityShield: getAssetUrl("b84f1.svg"),
  backChevron: getAssetUrl("71d1f.svg"),
  backArrowDark: getAssetUrl("01027.svg"),
  backArrowLight: getAssetUrl("979bb.svg"),
  forwardArrow: getAssetUrl("34195.svg"),
  forwardGreenArrow: getAssetUrl("b971a.svg"),
  checkGreen: getAssetUrl("d2901.svg"),
  checkWhite: getAssetUrl("137a4.svg"),
  checkSmall: getAssetUrl("9306e.svg"),
  locationPin: getAssetUrl("cc7ca.svg"),

  // Karakter & Foto Pengguna
  nitaIllustration: getAssetUrl("0817e.png"),
  nitaAvatar: getAssetUrl("486a1.png"),
  mamaNurAvatar: getAssetUrl("58a27.png"),
  childFishBanner: getAssetUrl("4892a.png"),
  gardenBanner: getAssetUrl("nita_harvest_garden.jpg"),
  nitaHarvestGarden: getAssetUrl("nita_harvest_garden.jpg"),

  // Icon Fitur Beranda
  featurePanganLokal: getAssetUrl("6dcad.svg"),
  featureSimulator: getAssetUrl("57f73.svg"),
  featureEdukasi: getAssetUrl("78ba3.svg"),
  featureResep: getAssetUrl("93b6c.svg"),

  // Resep & Pangan
  recipePapeda: getAssetUrl("8ca8f.png"),
  recipeAbonLele: getAssetUrl("1c091.png"),
  recipeSupBening: getAssetUrl("ddaac.png"),
  recipeBuburSagu: getAssetUrl("80f0e.png"),
  foodKakap: getAssetUrl("bd6ad.png"),
  foodUdang: getAssetUrl("d85be.png"),
  foodKelor: getAssetUrl("94efa.png"),
  foodSagu: getAssetUrl("8074b.png"),

  // Audio & Pemindai
  soundWave: getAssetUrl("60487.svg"),
  speakerIcon: getAssetUrl("f87cb.svg"),
  playButton: getAssetUrl("f5574.svg"),
  listenIcon: getAssetUrl("14e50.svg"),
  cameraBasket: getAssetUrl("0dc3f.png"),
  flashIcon: getAssetUrl("03629.svg"),
  galleryIcon: getAssetUrl("a3343.svg"),
  sparkleIcon: getAssetUrl("7c8d0.svg"),
  weightPencil: getAssetUrl("e1b71.svg"),

  // Navigasi Bottom Nav
  navHomeActive: getAssetUrl("ff679.svg"),
  navHomeInactive: getAssetUrl("22e46.svg"),
  navScanner: getAssetUrl("28589.svg"),
  navNitaActive: getAssetUrl("1d324.svg"),
  navNitaInactive: getAssetUrl("006f9.svg"),
  navProfileActive: getAssetUrl("1f52f.svg"),
  navProfileInactive: getAssetUrl("0d2fe.svg"),

  // Chat
  callIcon: getAssetUrl("043cd.svg"),
  voiceWaveOrange: getAssetUrl("69474.svg"),
  voiceWaveGreen: getAssetUrl("68f0c.svg"),
  sendIcon: getAssetUrl("58912.svg"),
};
