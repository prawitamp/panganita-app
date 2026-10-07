import {
  findProfile,
  updateProfileData,
  insertChild,
  deleteChildById,
} from "@/lib/repositories/profileRepository";
import {
  validateProfileInput,
  validateChildInput,
} from "@/lib/validations/profileValidation";

export function getProfileService() {
  return findProfile();
}

export function updateProfileService(body) {
  const validation = validateProfileInput(body);
  if (!validation.valid) {
    return { success: false, status: 400, error: validation.error };
  }

  const updated = updateProfileData(body);
  return { success: true, status: 200, data: updated };
}

export function registerChildService(childData) {
  const validation = validateChildInput(childData);
  if (!validation.valid) {
    return { success: false, status: 400, error: validation.error };
  }

  const child = insertChild({
    name: childData.name.trim(),
    age: String(childData.age),
    ageUnit: childData.ageUnit || "tahun",
    note: childData.note || "Tumbuh Kembang Anak",
  });

  return { success: true, status: 201, data: child };
}

export function unregisterChildService(childId) {
  const success = deleteChildById(childId);
  if (!success) {
    return { success: false, status: 404, error: "Data anak tidak ditemukan" };
  }

  return { success: true, status: 200, message: "Data anak berhasil dihapus" };
}
