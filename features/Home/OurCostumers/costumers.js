import hirokai from '../../../public/customers/hirokai.png';
import kaax from '../../../public/customers/Kaax.png';
import lanaNoche from '../../../public/customers/lana_noche.png';
import luluKisha from '../../../public/customers/lulu_kisha.png';

const customers = [
  {
    name: 'Mario Quesada',
    socialMedia: {
      user: '@the_adventurous_collies_cr',
      link: 'https://instagram.com/the_adventurous_collies_cr',
    },
    thumbnail: {
      image: kaax,
      alt: 'Perro de raza border collie comiendo feliz',
    },
    quote:
      'Siempre me costó que Kaax comiera del alimento seco, y luego de investigar un poco fui consciente de que los perros en su ambiente natural son carnívoros, y empecé a buscar opciones de alimentación natural acá en Costa Rica, sin embargo, las opciones que hay o son muy caras, o carecen de conocimientos, pero en DNAture, encontré el mejor balance, gracias a los precios cómodos y la supervisión de Yuli, la nutri.',
  },
  {
    name: 'Diana Castillo',
    socialMedia: null,
    thumbnail: {
      image: luluKisha,
      alt: 'Mujer feliz con lentes oscuros posa con un perrito en brazo y otro a sus pies en una terraza',
    },
    quote:
      'Para mí, saber que estoy dándole a Lulú y a Kisha no solo un alimento de calidad, si no lo que ellas necesitan a nivel nutricional me da la tranquilidad que necesitaba, especialmente después de tanto tiempo de buscar sin encontrar soluciones realmente adecuadas para ellas. El interés que vi en la asesoría nutricional por el bienestar de mis perritas significó mucho y me dio la confianza para continuar adquiriendo sus productos.',
  },
  {
    name: 'Diana Murillo',
    socialMedia: {
      user: '@ddanubiocostarica',
      link: 'https://instagram.com/ddanubiocostarica',
    },
    thumbnail: {
      image: lanaNoche,
      alt: 'Dos perritos mirando a la cámara',
    },
    quote:
      'La calidad de vida de Lana y Noche con la alimentación natural de DNAture cambió para bien , se les nota en el pelaje brillante, no tienen mal aliento, ni sarro y lo mejor de todo pasaron de ser perritas con poco interés en la comida a ser su momento favorito, estoy demasiado agradecida con todo el equipo porque no solo es vender alimento, si no que me han dado todo el apoyo y guía en el tema de alimentación natural y consciente para mis peluditas.',
  },
  {
    name: 'Isaac Ramírez',
    socialMedia: {
      user: '@hiro_and_kai_the_sammies',
      link: 'https://www.instagram.com/hiro_and_kai_the_sammies/',
    },
    thumbnail: {
      image: hirokai,
      alt: 'Hombre feliz en la montaña con 2 perros somayedo color blanco',
    },
    quote:
      'Hiro y Kai están súper musculosos, el pelo lindísimo, están perfectos y saludables. Comen como nunca han comido. ¡Yo estoy muy feliz!',
  },
];

export default customers;
