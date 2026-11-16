/** Sales preference is based on each pet's daily MIX, after the package split. */
export const smallMixPresentationGrams = 200;
export function prefersSmallMix(dailyMixGrams: number) {
  return Number.isFinite(dailyMixGrams) && dailyMixGrams > 0 && dailyMixGrams <= smallMixPresentationGrams;
}
export const smallMixPresentationNote = "Para porciones de mezcla de 200 g diarios o menos se priorizan tacitas de 200 g. Si no hay suficientes disponibles, se completa con otras presentaciones verificadas respetando la conservación. El tamaño del envase no aumenta la ración.";
