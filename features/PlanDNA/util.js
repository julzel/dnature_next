const dogPortionSizes = {
  adult: {
    small: {
      castrated: {
        underWeight: {
          sedentary: '3.5',
          active: '4',
          veryActive: '4.5',
        },
        ideal: {
          sedentary: '3',
          active: '3.5',
          veryActive: '4',
        },
        overWeight: {
          sedentary: '2.5',
          active: '3',
        },
      },
      notCastrated: {
        underWeight: {
          sedentary: '4',
          active: '4.5',
          veryActive: '5',
        },
        ideal: {
          sedentary: '3.5',
          active: '4',
          veryActive: '4.5',
        },
        overWeight: {
          sedentary: '2.5',
          active: '3',
        },
      },
    },
    medium: {
      castrated: {
        underWeight: {
          sedentary: '3',
          active: '3.5',
          veryActive: '4',
        },
        ideal: {
          sedentary: '2.5',
          active: '3',
          veryActive: '3.5',
        },
        overWeight: {
          sedentary: '2',
          active: '2.5',
        },
      },
      noCastrado: {
        underWeight: {
          sedentary: '3.5',
          active: '4',
          veryActive: '4.5',
        },
        ideal: {
          sedentary: '3',
          active: '3.5',
          veryActive: '4',
        },
        overWeight: {
          sedentary: '2.5',
          active: '3',
        },
      },
    },
    large: {
      castrated: {
        underWeight: {
          sedentary: '2.5',
          active: '3',
          veryActive: '3.5',
        },
        ideal: {
          sedentary: '2',
          active: '2.5',
          veryActive: '3',
        },
        overWeight: {
          sedentary: '1.5',
          active: '2',
        },
      },
      noCastrado: {
        underWeight: {
          sedentary: '3',
          active: '3.5',
          veryActive: '4',
        },
        ideal: {
          sedentary: '2.5',
          active: '3',
          veryActive: '3.5',
        },
        overWeight: {
          sedentary: '2',
          active: '2.5',
        },
      },
    },
  },
  puppy: {
    stage1: '10',
    stage2: '7',
    stage3: '4',
  },
};

const calculatePortionSizeInGrams = ({
  age,
  puppyStage,
  size,
  castrated,
  bodyContexture,
  dailyActivity,
  weight,
}) => {
  let weightPercentage;

  if (age === 'adult') {
    weightPercentage =
      dogPortionSizes[age][size][castrated][bodyContexture][dailyActivity];
  } else {
    weightPercentage = dogPortionSizes[age][puppyStage];
  }

  return weightPercentage * parseFloat(weight) * 10;
};

export { calculatePortionSizeInGrams };
