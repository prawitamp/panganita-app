import "./globals.css";
import { PanganitaProvider } from "@/context/PanganitaContext";

export const metadata = {
  title: "Panganita — Sahabat Gizi & Panen Ibu Nusantara | Kelompok 10 Malahayati",
  description:
    "Aplikasi pendamping keluarga untuk mengolah hasil panen pekarangan menjadi gizi pencegah stunting pada 1.000 Hari Pertama Kehidupan (HPK). Proyek Tugas Akhir Kelompok 10 Malahayati.",
  keywords: [
    "Panganita",
    "Gizi Keluarga",
    "Cegah Stunting",
    "1000 HPK",
    "Panen Pekarangan",
    "Kelompok Malahayati",
    "Posyandu",
  ],
  authors: [{ name: "Kelompok 10 Malahayati" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/assets/b547c.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PanganitaProvider>{children}</PanganitaProvider>
      </body>
    </html>
  );
}
