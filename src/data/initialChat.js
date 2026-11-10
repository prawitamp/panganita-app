import { formatRegionTime } from "../lib/regionTimezone.js";

export const getInitialChatMessages = (location = "") => [
  {
    id: "welcome-nita",
    sender: "nita",
    senderName: "Bu Nita AI",
    time: formatRegionTime(new Date(), location),
    text: "Assalamu'alaikum, Ibu! Saya Bu Nita, asisten gizi Panganita. Saya siap membantu Ibu memahami gizi keluarga, bahan pangan, dan pencegahan stunting. Yuk, kita belajar bersama. Ada yang ingin Ibu tanyakan?",
    voiceNote: {
      duration: "0:14",
      icon: "68f0c.svg",
    },
  },
];

export const initialChatMessages = getInitialChatMessages();
