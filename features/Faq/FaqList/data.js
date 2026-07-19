const FAQ = [
  {
    question: '¿Cuáles son los pasos para darle una dieta natural de DNAture a mi mascota?',
    blocks: [
      { type: 'paragraph', text: 'Las recetas completas DNAture tienen todo lo necesario para satisfacer las necesidades nutricionales de tu mascota.' },
      { type: 'paragraph', text: 'En DNAture hacemos que la transición sea sencilla para ti y adecuada para tu mascota.' },
      { type: 'ordered-list', items: ['Calculamos la porción diaria que requiere tu perro.', 'Nos indicas las proteínas que quieres adquirir.', 'Coordinamos el retiro en nuestro local o el envío a domicilio.', 'El pago se realiza por SINPE Móvil al número 7184-8868.'] },
      { type: 'paragraph', text: 'Si tienes dudas sobre almacenar, manipular o dar el alimento, en esta sección encontrarás más información.' },
      { type: 'note', text: '(*) El costo del envío corre por cuenta del cliente.' },
    ],
  },
  {
    question: '¿En qué consisten las RECETAS COMPLETAS DNATURE?',
    blocks: [
      { type: 'paragraph', content: ['Las recetas completas DNAture están formuladas para cumplir los requerimientos nutricionales de tu mascota según los parámetros de ', { text: 'AAFCO', href: 'https://www.aafco.org/' }, ' y ', { text: 'FEDIAF', href: 'https://www.fediaf.org/' }, '.'] },
      { type: 'paragraph', text: 'Cada receta es una mezcla de una o más proteínas de alta calidad con suplementos naturales que aportan vitaminas, minerales, ácidos grasos y antioxidantes.' },
      { type: 'paragraph', text: 'Las recetas vienen en presentaciones de 500 g y 1.000 g y deben almacenarse congeladas.' },
      { type: 'note', text: 'Para cachorros o adultos sanos. Consulta con nosotros si tu mascota tiene una alergia, patología o deficiencia específica.' },
    ],
  },
  {
    question: '¿Cuáles ingredientes incluyen las RECETAS COMPLETAS DNATURE?',
    blocks: [
      { type: 'paragraph', text: 'Las proteínas de nuestra oferta se seleccionan para brindar un alto porcentaje proteico por porción.' },
      { type: 'paragraph', text: 'También incorporamos espinaca, kale, cúrcuma, espirulina y omega 6 para complementar los nutrientes que la carne no aporta por sí sola.' },
    ],
  },
  {
    question: '¿La dieta es cruda o cocinada?',
    blocks: [
      { type: 'paragraph', text: 'La carne cruda contiene nutrientes y proteínas que tu perro requiere. Al cocinarla, este contenido disminuye por la pérdida de humedad y el cambio químico de los alimentos.' },
      { type: 'paragraph', text: 'Cuando sea posible, recomendamos servirla cruda. Si tu perro requiere una dieta cocida, contáctanos para conocer las opciones disponibles.' },
    ],
  },
  {
    question: '¿Puedo cocinar la carne si a mi perro no le gusta cruda?',
    blocks: [
      { type: 'paragraph', text: 'Recomendamos hacer una transición progresiva cocinándola aproximadamente al 75 %, sin aceite ni sal, y sirviéndola a temperatura ambiente.' },
      { type: 'paragraph', text: 'Reduce la cocción progresivamente según tu perro vaya aceptándola. Los tiempos de transición varían según su gusto y flexibilidad.' },
    ],
  },
  {
    question: '¿Cómo transiciono a mi mascota a una dieta natural cruda?',
    blocks: [
      { type: 'paragraph', text: 'Para perros sanos, cachorros, hembras en gestación o lactancia y seniors, haz una transición gradual:' },
      { type: 'unordered-list', items: ['Día 1: sustituye el 25 % de la ración por dieta natural.', 'Día 2: sustituye el 50 % de la ración.', 'Día 3: sustituye el 75 % de la ración.', 'Día 4: sirve el 100 % de carne cruda.'] },
      { type: 'paragraph', text: 'Los cachorros que recién dejaron la lactancia pueden consumir la dieta cruda sin necesidad de transición.' },
    ],
  },
  {
    question: '¿En qué consiste la transición por ayuno?',
    blocks: [
      { type: 'paragraph', text: 'En perros sanos con buen apetito, la transición puede realizarse después de un día de ayuno.' },
      { type: 'paragraph', text: 'Asegúrate de que tenga suficiente agua. Después del ayuno sirve el 50 % de la ración diaria y el otro 50 % doce horas después.' },
      { type: 'note', text: 'No apliques esta transición a cachorros, perros de raza mini, hembras en gestación o lactancia, ni perros senior.' },
    ],
  },
  {
    question: '¿Cuánto alimento le debo dar a mi mascota?',
    blocks: [
      { type: 'paragraph', text: 'Un perro adulto suele necesitar entre el 2,5 % y el 3,5 % de su peso corporal al día. Los cachorros requieren una proporción mayor.' },
      { type: 'paragraph', content: ['El porcentaje depende del tamaño, castración, actividad física y peso actual. Puedes usar nuestra ', { text: 'calculadora', href: '/calculadora' }, ' para estimar la porción diaria.'] },
    ],
  },
  {
    question: '¿Cuántas veces al día debo alimentar a mi mascota?',
    blocks: [
      { type: 'paragraph', text: 'La frecuencia depende de la edad y estilo de vida de tu mascota.' },
      { type: 'unordered-list', items: ['Menores de 4 meses: 4 veces al día.', 'De 4 a 6 meses: 3 veces al día.', 'De 6 meses a un año: 2 veces al día.', 'Mayores de un año: 1 vez al día.'] },
    ],
  },
  {
    question: '¿Cómo se sirve la comida?',
    blocks: [
      { type: 'paragraph', text: 'Descongela el producto en el refrigerador durante al menos 20 a 24 horas y mantenlo a una temperatura no mayor a 5 °C.' },
      { type: 'paragraph', text: 'Sirve la comida en una taza limpia y limpia el recipiente después de cada uso. El producto descongelado puede mantenerse hasta tres días en refrigeración.' },
    ],
  },
  {
    question: '¿Cómo debo almacenar el producto?',
    blocks: [
      { type: 'paragraph', text: 'El producto debe mantenerse congelado y puede durar hasta tres meses.' },
      { type: 'paragraph', text: 'Una vez descongelado, consérvalo en refrigeración y úsalo dentro de tres días.' },
    ],
  },
];

export default FAQ;
