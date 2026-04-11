import { STORAGE_KEY } from "../collections/properties.collection";
import { listCollection } from "../database";
import { propertiesCollectionMetadata } from "../metadata/properties.metadata";

export function getSeedProperties() {
  return listCollection(propertiesCollectionMetadata.name);
}

export function getCustomPropertiesStorageKey() {
  return STORAGE_KEY;
}

export function getCustomPropertiesFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}
