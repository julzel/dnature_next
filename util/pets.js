import { generatePurchaseOrderId } from './id-generator';

const createPetId = () => generatePurchaseOrderId().replace(/^DN-/, 'pet-');

const legacyPetId = (pet, index) => {
  const source = JSON.stringify([
    pet?.name || '',
    pet?.age || '',
    pet?.size || '',
    pet?.weight || '',
    index,
  ]);
  let hash = 2166136261;

  for (const character of source) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return `legacy-pet-${(hash >>> 0).toString(36)}`;
};

const normalizePets = (pets) => {
  const usedIds = new Set();

  return (Array.isArray(pets) ? pets : []).map((pet, index) => {
    const candidate =
      typeof pet?.id === 'string' && pet.id.trim()
        ? pet.id.trim()
        : legacyPetId(pet, index);
    let id = candidate;
    let duplicateIndex = 1;

    while (usedIds.has(id)) {
      id = `${candidate}-${duplicateIndex}`;
      duplicateIndex += 1;
    }

    usedIds.add(id);
    return { ...pet, id };
  });
};

const normalizeClientPets = (client) => ({
  ...client,
  pets: normalizePets(client?.pets),
});

export { createPetId, normalizeClientPets, normalizePets };
