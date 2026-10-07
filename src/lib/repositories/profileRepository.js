import { profile } from "@/lib/db";

export function findProfile() {
  return profile;
}

export function updateProfileData(fields) {
  Object.assign(profile, fields);
  return profile;
}

export function insertChild(childData) {
  if (!profile.children) {
    profile.children = [];
  }
  const newChild = {
    id: `c-${Date.now()}`,
    ...childData,
  };
  profile.children.push(newChild);
  return newChild;
}

export function deleteChildById(childId) {
  if (!profile.children) return false;
  const initialLen = profile.children.length;
  profile.children = profile.children.filter((c) => c.id !== childId);
  return profile.children.length < initialLen;
}
