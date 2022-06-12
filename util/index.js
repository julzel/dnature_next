const dog = {
    adulto: {
        pequeno: {
            castrado: {
                bajoPeso: {
                    sedentario: '3.5',
                    activo: '4',
                    deportista: '4.5',
                },
                pesoIdeal: {
                    sedentario: '3',
                    activo: '3.5',
                    deportista: '4',
                },
                sobrepeso: {
                    sedentario: '2.5',
                    activo: '3',
                }
            },
            noCastrado: {
                bajoPeso: {
                    sedentario: '4',
                    activo: '4.5',
                    deportista: '5',
                },
                pesoIdeal: {
                    sedentario: '3.5',
                    activo: '4',
                    deportista: '4.5',
                },
                sobrepeso: {
                    sedentario: '2.5',
                    activo: '3',
                }
            }
        },
        mediano: {
            castrado: {
                bajoPeso: {
                    sedentario: '3',
                    activo: '3.5',
                    deportista: '4',
                },
                pesoIdeal: {
                    sedentario: '2.5',
                    activo: '3',
                    deportista: '3.5',
                },
                sobrepeso: {
                    sedentario: '2',
                    activo: '2.5',
                }
            },
            noCastrado: {
                bajoPeso: {
                    sedentario: '3.5',
                    activo: '4',
                    deportista: '4.5',
                },
                pesoIdeal: {
                    sedentario: '3',
                    activo: '3.5',
                    deportista: '4',
                },
                sobrepeso: {
                    sedentario: '2.5',
                    activo: '3',
                }
            }
        },
        grande: {
            castrado: {
                bajoPeso: {
                    sedentario: '2.5',
                    activo: '3',
                    deportista: '3.5',
                },
                pesoIdeal: {
                    sedentario: '2',
                    activo: '2.5',
                    deportista: '3',
                },
                sobrepeso: {
                    sedentario: '1.5',
                    activo: '2',
                }
            },
            noCastrado: {
                bajoPeso: {
                    sedentario: '3',
                    activo: '3.5',
                    deportista: '4',
                },
                pesoIdeal: {
                    sedentario: '2.5',
                    activo: '3',
                    deportista: '3.5',
                },
                sobrepeso: {
                    sedentario: '2',
                    activo: '2.5',
                }
            }
        },
    },
    cachorro: {
        stage1: '10',
        stage2: '7',
        stage3: '4',
    }
}

const calculatePortionSizeInGrams = ({ age, stage, size, castrated, weightStatus, activity, weight }) => {
    let weightPercentage

    if (age === 'adulto') {
        weightPercentage = dog[age][size][castrated][weightStatus][activity]
    } else {
        weightPercentage = dog[age][stage]
    }

    return weightPercentage * weight * 10
}

const labelKeys = {
    age: 'Edad',
    size: 'Tamaño',
    castrated: 'Castración',
    weightStatus: 'Contextura',
    activity: 'Actividad física',
    weight: 'Peso en kilogramos'
}

const valueKeys = {
    adulto: 'Adulto',
    cachorro: 'Cachorro',
    castrado: 'Castrado',
    noCastrado: 'Sin castrar',
    pequeno: 'Mini',
    mediano: 'Pequeño - Mediano',
    grande: 'Grande - Gigante',
    bajoPeso: 'Bajo peso',
    pesoIdeal: 'Ideal',
    sobrepeso: 'Sobrepeso',
    sedentario: 'Sendentario',
    activo: 'Activo',
    deportista: 'Deportista'
}

export { calculatePortionSizeInGrams, labelKeys, valueKeys }