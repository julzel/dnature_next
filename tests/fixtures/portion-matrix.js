const cartesian = (values) =>
  values.reduce(
    (rows, options) => rows.flatMap((row) => options.map((option) => [...row, option])),
    [[]]
  );

const adultPortionMatrix = cartesian([
  ['small', 'medium', 'large'],
  ['castrated', 'notCastrated'],
  ['underWeight', 'ideal', 'overWeight'],
  ['sedentary', 'active', 'veryActive'],
]).map(([size, castrated, bodyContexture, dailyActivity]) => ({
  age: 'adult',
  size,
  castrated,
  bodyContexture,
  dailyActivity,
  weight: 10,
}));

const isKnownUnsupportedProfile = ({ bodyContexture, dailyActivity }) =>
  bodyContexture === 'overWeight' && dailyActivity === 'veryActive';

const supportedAdultProfiles = adultPortionMatrix.filter(
  (profile) => !isKnownUnsupportedProfile(profile)
);
const unsupportedAdultProfiles = adultPortionMatrix.filter(isKnownUnsupportedProfile);

export {
  adultPortionMatrix,
  supportedAdultProfiles,
  unsupportedAdultProfiles,
};
