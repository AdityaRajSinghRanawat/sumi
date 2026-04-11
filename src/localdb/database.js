import { seedProperties } from "./collections/properties.collection";

const localCollections = {
  properties: [...seedProperties],
};

export function listCollection(collectionName) {
  return [...(localCollections[collectionName] || [])];
}

export function findInCollection(collectionName, predicate) {
  const collection = localCollections[collectionName] || [];
  if (typeof predicate !== "function") return [...collection];
  return collection.filter(predicate);
}

export function insertOne(collectionName, document) {
  if (!localCollections[collectionName]) {
    localCollections[collectionName] = [];
  }

  localCollections[collectionName].push(document);
  return document;
}
