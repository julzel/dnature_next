const createPetId = (cryptoProvider = globalThis.crypto) => {
  const uuid = cryptoProvider?.randomUUID?.();

  if (uuid) {
    return `pet-${uuid}`;
  }

  if (!cryptoProvider?.getRandomValues) {
    throw new Error('Secure random values are unavailable.');
  }

  const bytes = cryptoProvider.getRandomValues(new Uint8Array(16));
  const id = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');

  return `pet-${id}`;
};

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
