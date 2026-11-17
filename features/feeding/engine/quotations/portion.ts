/** Port of dnature_next/util/portion-size.js. Species-independent by merchant instruction. */
export type PortionProfile = {
  weight: number; lifeStage: "adult" | "growing"; size: "small" | "medium" | "large";
  neutered: boolean; body: "thin" | "ideal" | "overweight"; activity: "calm" | "normal" | "active";
  growthStage?: "stage1" | "stage2" | "stage3";
};
const adultPercentages = {
  small: {
    neutered: { thin: [3.5, 4, 4.5], ideal: [3, 3.5, 4], overweight: [2.5, 3, null] },
    intact: { thin: [4, 4.5, 5], ideal: [3.5, 4, 4.5], overweight: [2.5, 3, null] },
  },
  medium: {
    neutered: { thin: [3, 3.5, 4], ideal: [2.5, 3, 3.5], overweight: [2, 2.5, null] },
    intact: { thin: [3.5, 4, 4.5], ideal: [3, 3.5, 4], overweight: [2.5, 3, null] },
  },
  large: {
    neutered: { thin: [2.5, 3, 3.5], ideal: [2, 2.5, 3], overweight: [1.5, 2, null] },
    intact: { thin: [3, 3.5, 4], ideal: [2.5, 3, 3.5], overweight: [2, 2.5, null] },
  },
} as const;
const growthPercentages = { stage1: 10, stage2: 7, stage3: 4 } as const;
const activityIndex = { calm: 0, normal: 1, active: 2 } as const;
export function isValidWeight(weight: number) {
  return Number.isFinite(weight) && weight >= .1 && weight <= 100;
}
export function calculatePortion(profile: PortionProfile): number | null {
  if (!isValidWeight(profile.weight)) return null;
  const percentage = profile.lifeStage === "growing"
    ? profile.growthStage && growthPercentages[profile.growthStage]
    : adultPercentages[profile.size]?.[profile.neutered ? "neutered" : "intact"]?.[profile.body]?.[activityIndex[profile.activity]];
  return percentage == null ? null : percentage * profile.weight * 10;
}
