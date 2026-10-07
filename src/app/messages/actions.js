"use server";

import { messages } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const phone = formData.get("phone") || "-";

  if (!name || !message) {
    return { success: false, error: "Nama dan pesan pertanyaan wajib diisi." };
  }

  const newMessage = {
    id: Date.now(),
    name: String(name).trim(),
    email: email ? String(email).trim() : "nurhayati.babo@panganita.id",
    phone: String(phone).trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);
  revalidatePath("/messages");

  return { success: true, data: newMessage };
}

export async function deleteMessageAction(id) {
  const index = messages.findIndex((m) => String(m.id) === String(id));
  if (index !== -1) {
    messages.splice(index, 1);
    revalidatePath("/messages");
    return { success: true, message: "Pesan berhasil dihapus" };
  }

  return { success: false, error: "Pesan tidak ditemukan" };
}
