const paragraph = (text) => ({ type: 'paragraph', text });
const note = (text) => ({ type: 'note', text });
const linkParagraph = (...content) => ({ type: 'paragraph', content });
const list = (...items) => ({ type: 'unordered-list', items });

const faqCategories = [
  {
    id: 'alimentacion-natural',
    label: 'Alimentación natural',
    shortLabel: 'Alimentación',
    description: 'Conceptos básicos, transición, frecuencia y porciones.',
    icon: 'leaf',
    items: [
      {
        id: 'que-es-alimentacion-natural',
        question: '¿Qué es la alimentación natural para perros y gatos?',
        blocks: [
          paragraph('Es una forma de alimentar con ingredientes reales y seleccionados, dentro de una receta que debe considerar la especie, etapa de vida, tamaño, actividad y condición corporal de cada mascota.'),
          paragraph('Que un alimento sea “natural” no garantiza por sí solo que sea completo. También importan la formulación, la inocuidad, la cantidad y que el producto sea adecuado para el animal que lo recibe.'),
        ],
      },
      {
        id: 'natural-vs-barf',
        question: '¿La alimentación natural es lo mismo que BARF?',
        blocks: [
          paragraph('No necesariamente. BARF es un modelo de alimentación cruda basado en carne, huesos y vísceras. “Alimentación natural” es un concepto más amplio y puede incluir recetas crudas o cocinadas.'),
          paragraph('En cualquier modalidad, una mezcla de ingredientes no se vuelve completa automáticamente. Debe estar formulada para la especie y etapa de vida correspondientes.'),
          linkParagraph('Podés ampliar sobre los cuidados de las dietas crudas en la guía de ', { text: 'WSAVA', href: 'https://wsava.org/wp-content/uploads/2021/04/Raw-Meat-Based-Diets-for-Pets_WSAVA-Global-Nutrition-Toolkit.pdf' }, '.'),
        ],
      },
      {
        id: 'dietas-balanceadas-completas',
        question: '¿Las dietas de DNAture están balanceadas y completas?',
        blocks: [
          paragraph('DNAture Complete se ofrece como una dieta completa y balanceada. Las mezclas, snacks y suplementos tienen propósitos distintos y no deben asumirse como alimento completo.'),
          paragraph('Revisá la descripción de cada producto para confirmar la especie y etapa de vida para las que fue formulado. “Completa” significa que aporta los nutrientes requeridos; “balanceada”, que los aporta en las proporciones correctas.'),
          linkParagraph('Conocé cómo identificar una declaración de adecuación nutricional en ', { text: 'AAFCO', href: 'https://www.aafco.org/consumers/understanding-pet-food/reading-labels/' }, '.'),
        ],
      },
      {
        id: 'natural-vs-concentrado',
        question: '¿Qué diferencia hay entre una dieta natural y un concentrado?',
        blocks: [
          paragraph('Se diferencian principalmente en ingredientes, humedad, procesamiento, presentación y conservación. El concentrado suele ser seco y estable a temperatura ambiente; muchas dietas naturales tienen mayor humedad y requieren refrigeración o congelación.'),
          paragraph('Ninguna presentación es adecuada solo por su formato. Lo importante es que cubra las necesidades de la mascota, se manipule de forma segura y se sirva en la cantidad correcta.'),
        ],
      },
      {
        id: 'alimentacion-diaria',
        question: '¿Mi perro o gato puede comer alimentación natural todos los días?',
        blocks: [
          paragraph('Sí, cuando el producto está formulado como dieta completa para su especie y etapa de vida y la ración se ajusta a sus necesidades. Los snacks, suplementos y mezclas complementarias no sustituyen por sí solos una dieta completa.'),
        ],
      },
      {
        id: 'combinar-con-concentrado',
        question: '¿Puedo combinar alimentación natural con concentrado?',
        blocks: [
          paragraph('Puede hacerse, pero hay que ajustar ambas cantidades para no duplicar calorías ni nutrientes. La proporción adecuada depende del objetivo, la dieta base y la tolerancia de la mascota.'),
          paragraph('Nuestro equipo puede ayudarte con una orientación inicial. Si existe una enfermedad, alergia diagnosticada o dieta terapéutica, consultá primero con su médico veterinario.'),
        ],
      },
      {
        id: 'cambio-de-un-dia-para-otro',
        question: '¿Puedo cambiar de concentrado a alimentación natural de un día para otro?',
        blocks: [
          paragraph('Preferimos una transición progresiva. Un cambio repentino puede causar rechazo o molestias digestivas, aunque cada mascota responde de manera distinta.'),
        ],
      },
      {
        id: 'como-hacer-transicion',
        question: '¿Cómo hago la transición a una dieta natural?',
        blocks: [
          paragraph('Introducí la dieta nueva poco a poco mientras reducís la anterior. Observá apetito, heces, vómitos, gases y comodidad general antes de aumentar la proporción.'),
          list('Empezá con una porción pequeña de la dieta nueva.', 'Aumentá gradualmente si la tolerancia es buena.', 'Mantené horarios y cantidades consistentes.', 'Pausá el cambio y consultá si aparecen síntomas persistentes o intensos.'),
          note('No recomendamos ayunos ni un calendario rígido para todas las mascotas. Cachorros, gatitos, seniors y animales con condiciones médicas requieren especial cuidado.'),
        ],
      },
      {
        id: 'tiempo-de-adaptacion',
        question: '¿Cuánto tiempo tarda mi mascota en acostumbrarse?',
        blocks: [
          paragraph('Varía según su dieta anterior, apetito, sensibilidad digestiva y estado de salud. Algunas se adaptan en pocos días y otras necesitan una transición más lenta.'),
          paragraph('Si deja de comer, vomita repetidamente, presenta diarrea intensa o se muestra decaída, detené la transición y consultá con su médico veterinario.'),
        ],
      },
      {
        id: 'cantidad-diaria',
        question: '¿Qué cantidad de comida debe comer mi mascota al día?',
        blocks: [
          paragraph('La ración es individual. Se estima a partir del peso, especie, edad, etapa de vida, esterilización, actividad y condición corporal; después se ajusta observando su evolución.'),
          linkParagraph('Usá nuestra ', { text: 'calculadora de porciones', href: '/calculadora' }, ' para obtener un punto de partida.'),
        ],
      },
      {
        id: 'factores-de-la-racion',
        question: '¿La cantidad depende del peso, edad o actividad?',
        blocks: [
          paragraph('Depende de todos esos factores y también de la condición corporal, esterilización, objetivo y densidad calórica del producto. Dos mascotas con el mismo peso pueden necesitar cantidades diferentes.'),
        ],
      },
      {
        id: 'cachorros-y-gatitos',
        question: '¿La alimentación natural sirve para cachorros y gatitos?',
        blocks: [
          paragraph('Sí, siempre que la receta indique que es adecuada para crecimiento y para la especie correspondiente. Cachorros y gatitos tienen necesidades distintas a las de un adulto; no se debe asumir que cualquier mezcla natural es apropiada.'),
        ],
      },
      {
        id: 'mascotas-senior',
        question: '¿También pueden comerla perros y gatos senior?',
        blocks: [
          paragraph('Sí, pero la elección y la porción deben considerar su condición corporal, actividad, dentición y cualquier diagnóstico. Un animal senior con una condición médica necesita recomendación veterinaria individual.'),
        ],
      },
    ],
  },
  {
    id: 'dietas-dnature',
    label: 'Dietas DNAture',
    shortLabel: 'Dietas',
    description: 'Ingredientes, proteínas, Complete, suplementos y preparación.',
    icon: 'bone',
    items: [
      {
        id: 'ingredientes-de-las-dietas',
        question: '¿Qué ingredientes contienen las dietas?',
        blocks: [paragraph('Los ingredientes cambian según la receta. La ficha de cada producto muestra su composición y propósito; revisala antes de comprar, especialmente si tu mascota tiene restricciones.'), linkParagraph('Consultá las opciones actuales en el ', { text: 'catálogo de productos', href: '/productos' }, '.')],
      },
      {
        id: 'proteinas-disponibles',
        question: '¿Qué proteínas tienen disponibles?',
        blocks: [paragraph('La disponibilidad puede variar. El catálogo muestra las presentaciones publicadas y nuestro equipo puede confirmar por WhatsApp qué proteínas están disponibles para tu pedido.')],
      },
      {
        id: 'elegir-proteina',
        question: '¿Puedo elegir la proteína que quiero darle a mi mascota?',
        blocks: [paragraph('Podés elegir entre las opciones disponibles y compatibles con el producto. Si la elección responde a una alergia o enfermedad, hacela con orientación veterinaria y no solo por preferencia.')],
      },
      {
        id: 'alergias-intolerancias',
        question: '¿Qué hago si mi mascota tiene alergias o intolerancias?',
        blocks: [paragraph('Una alergia debe identificarse correctamente. Cambiar de proteína sin un plan puede dificultar el diagnóstico. Compartí con nosotros los ingredientes que indicó evitar su médico veterinario para revisar opciones disponibles.'), note('DNAture no sustituye una dieta de eliminación ni un tratamiento veterinario. Confirmá también el riesgo de trazas cuando sea relevante.')],
      },
      {
        id: 'necesidades-especificas',
        question: '¿Pueden preparar una dieta para una mascota con necesidades específicas?',
        blocks: [paragraph('Podemos orientarte sobre los productos disponibles. Una condición diagnosticada, una dieta terapéutica o una restricción clínica requiere evaluación y seguimiento del médico veterinario; no confirmamos una preparación especial sin esa revisión.')],
      },
      {
        id: 'complete-vs-mezclas',
        question: '¿Qué diferencia hay entre DNAture Complete y las otras mezclas?',
        blocks: [paragraph('DNAture Complete se presenta como dieta completa y balanceada. Otras mezclas, snacks o suplementos pueden ser complementarios y tener un uso específico. La ficha de producto indica cómo debe utilizarse cada uno.')],
      },
      {
        id: 'contienen-huesos',
        question: '¿Las dietas contienen huesos?',
        blocks: [paragraph('Depende de la receta y de cómo fue formulada. Revisá los ingredientes del producto o consultanos por la presentación específica. No agregués huesos por tu cuenta para intentar “balancear” una dieta.')],
      },
      {
        id: 'contienen-visceras',
        question: '¿Las dietas contienen vísceras?',
        blocks: [paragraph('Algunas formulaciones pueden incluir órganos como fuente de nutrientes. La composición exacta aparece en la ficha de cada producto.')],
      },
      {
        id: 'agregar-suplementos',
        question: '¿Es necesario agregar suplementos a la dieta?',
        blocks: [paragraph('No para “completar” DNAture Complete cuando se usa según su indicación. Añadir suplementos sin revisar la dieta base puede provocar excesos o desequilibrios.'), linkParagraph('AAFCO también recomienda valorar la dieta completa y la dosis antes de suplementar. ', { text: 'Leé su guía', href: 'https://www.aafco.org/consumers/understanding-pet-food/supplements/' }, '.')],
      },
      {
        id: 'cocinar-dieta',
        question: '¿Puedo cocinar la dieta?',
        blocks: [paragraph('No recomendamos cambiar el método de preparación de una receta completa sin revisar primero las instrucciones del producto. La cocción puede modificar humedad y nutrientes, y los huesos nunca deben cocinarse para ofrecerlos.')],
      },
      {
        id: 'balance-dieta-cocinada',
        question: '¿Las dietas cocinadas mantienen el mismo balance nutricional?',
        blocks: [paragraph('No debe asumirse. El resultado depende de la formulación original, temperatura, tiempo y pérdida de humedad. Si necesitás una opción cocinada, consultá cuáles productos están diseñados para ese uso.')],
      },
      {
        id: 'rotar-proteinas',
        question: '¿Puedo cambiar de proteína regularmente?',
        blocks: [paragraph('Puede ser posible cuando las recetas cumplen el mismo propósito y la mascota las tolera. Hacé los cambios gradualmente. Si se está investigando una alergia o sensibilidad, no rotés proteínas sin indicación veterinaria.')],
      },
    ],
  },
  {
    id: 'situaciones-especificas',
    label: 'Situaciones específicas',
    shortLabel: 'Casos específicos',
    description: 'Peso, digestión, alergias y suplementos con criterio veterinario.',
    icon: 'stethoscope',
    items: [
      {
        id: 'sobrepeso',
        question: '¿La alimentación natural puede ayudar a una mascota con sobrepeso?',
        blocks: [paragraph('El control de peso depende principalmente de una ración calórica adecuada, seguimiento de la condición corporal, actividad y constancia. Una dieta natural no produce pérdida de peso por sí sola.'), paragraph('Pedí una evaluación veterinaria para establecer un objetivo seguro y ajustar la ración conforme avance.')],
      },
      {
        id: 'mascotas-esterilizadas',
        question: '¿Qué alimentación recomiendan para mascotas esterilizadas?',
        blocks: [paragraph('Después de la esterilización pueden cambiar el apetito y el gasto energético. La opción adecuada depende de la especie, edad, actividad y condición corporal; suele ser necesario revisar la porción y monitorear el peso.')],
      },
      {
        id: 'cristales-estruvita',
        question: '¿Pueden hacer una dieta para perros con cristales de estruvita?',
        blocks: [paragraph('Los cristales o cálculos urinarios requieren diagnóstico veterinario, análisis de orina y seguimiento. No recomendamos formular ni cambiar una dieta para estruvita únicamente desde una FAQ.'), note('Compartí la indicación de su médico veterinario con el equipo antes de comprar. Si hay dificultad para orinar, dolor o ausencia de orina, buscá atención urgente.')],
      },
      {
        id: 'problemas-digestivos',
        question: '¿Qué alimentación puede recibir una mascota con problemas digestivos?',
        blocks: [paragraph('No existe una única dieta para todos los problemas digestivos. La duración, gravedad y causa de los síntomas determinan el manejo. Consultá al veterinario si hay vómitos repetidos, sangre, dolor, deshidratación, decaimiento o síntomas persistentes.')],
      },
      {
        id: 'adaptar-alergias',
        question: '¿Pueden adaptar la alimentación para perros con alergias?',
        blocks: [paragraph('Podemos revisar recetas que no incluyan los ingredientes identificados por el veterinario. Para diagnosticar alergias suele necesitarse un plan de eliminación controlado; cambiar ingredientes al azar puede alterar el resultado.')],
      },
      {
        id: 'suplementos-articulaciones',
        question: '¿Qué suplementos pueden ayudar a perros con problemas articulares?',
        blocks: [paragraph('El suplemento depende del diagnóstico, medicamentos, dieta y peso. Antes de elegir glucosamina, condroitina, omega-3, mejillón de labio verde u otro producto, consultá dosis, calidad y posibles interacciones con su veterinario.')],
      },
      {
        id: 'mejillon-labio-verde',
        question: '¿Qué es el mejillón de labio verde y para qué sirve?',
        blocks: [paragraph('Es un molusco marino utilizado como ingrediente en algunos suplementos articulares por sus lípidos y otros compuestos. No sustituye el diagnóstico ni garantiza alivio; la formulación y dosis del producto importan.'), note('Consultá antes de usarlo si existen alergias a mariscos, tratamientos médicos o una condición crónica.')],
      },
      {
        id: 'espirulina',
        question: '¿Puedo darle espirulina a mi perro?',
        blocks: [paragraph('No todas las mascotas la necesitan. La seguridad depende de la calidad del producto, dosis, dieta total y estado de salud. Evitá suplementos de origen incierto y consultá al veterinario antes de incorporarla de forma regular.')],
      },
      {
        id: 'come-tierra',
        question: '¿Qué pasa si mi perro come tierra?',
        blocks: [paragraph('Puede ser una conducta ocasional, pero también relacionarse con aburrimiento, malestar gastrointestinal, parásitos, anemia, deficiencias o ingestión de sustancias peligrosas. Evitá el acceso y comentáselo a su veterinario si se repite.'), note('Buscá atención pronta si ingirió fertilizantes, químicos u objetos, o presenta vómitos, dolor, debilidad o dificultad para defecar.')],
      },
      {
        id: 'piel-y-pelaje',
        question: '¿La dieta natural puede ayudar con la calidad del pelo y la piel?',
        blocks: [paragraph('Una alimentación completa aporta nutrientes necesarios para piel y pelaje, pero el formato “natural” no garantiza por sí solo una mejoría. Picazón, caída excesiva, lesiones u olor pueden tener causas dermatológicas, parasitarias, hormonales o alérgicas que requieren evaluación.')],
      },
    ],
  },
  {
    id: 'conservacion',
    label: 'Conservación y preparación',
    shortLabel: 'Conservación',
    description: 'Congelación, descongelado, refrigeración y manipulación segura.',
    icon: 'snowflake',
    items: [
      {
        id: 'almacenar-comida',
        question: '¿Cómo debo almacenar la comida?',
        blocks: [paragraph('Mantené congelados los productos que así lo indiquen y respetá siempre las instrucciones del empaque. Separalos de alimentos listos para comer y lavá manos, superficies y utensilios después de manipular alimento crudo.'), linkParagraph('La ', { text: 'FDA', href: 'https://www.fda.gov/animal-veterinary/animal-health-literacy/get-facts-raw-pet-food-diets-can-be-dangerous-you-and-your-pet' }, ' explica por qué la manipulación higiénica es especialmente importante con alimentos crudos.')],
      },
      {
        id: 'tiempo-descongelada',
        question: '¿Cuánto tiempo puede permanecer descongelada?',
        blocks: [paragraph('Como guía general de DNAture, mantenela refrigerada a no más de 5 °C y utilizala dentro de tres días, salvo que el empaque indique un plazo más corto. No la dejés a temperatura ambiente durante periodos prolongados.')],
      },
      {
        id: 'descongelar-correctamente',
        question: '¿Cómo descongelo correctamente la comida?',
        blocks: [paragraph('Pasá la porción del congelador al refrigerador con anticipación —habitualmente entre 20 y 24 horas— y mantenela en un recipiente cerrado que evite derrames. Descongelá únicamente lo que vas a utilizar.')],
      },
      {
        id: 'volver-a-congelar',
        question: '¿Puedo volver a congelar una dieta que ya descongelé?',
        blocks: [paragraph('Recomendamos no volver a congelar una porción completamente descongelada, especialmente si salió de refrigeración. Dividí las raciones antes de congelar para descongelar solo lo necesario.')],
      },
      {
        id: 'calentar-comida',
        question: '¿Puedo calentar la comida?',
        blocks: [paragraph('Seguí las indicaciones específicas del producto. Si solo necesitás quitarle el frío, consultanos el método recomendado; calentar o cocinar puede cambiar una receta y no debe improvisarse cuando contiene hueso.')],
      },
      {
        id: 'cocinar-dietas-conservacion',
        question: '¿Puedo cocinar las dietas?',
        blocks: [paragraph('No todas. Usá únicamente el método indicado para el producto. Si tu mascota necesita comida cocinada, preguntanos cuáles opciones están formuladas o preparadas para servirse de esa manera.')],
      },
      {
        id: 'duracion-refrigeracion',
        question: '¿Cuánto dura la comida en refrigeración?',
        blocks: [paragraph('Una vez descongelada, la guía general es hasta tres días a no más de 5 °C, salvo una instrucción distinta en el empaque. Anotá la fecha de descongelado para llevar control.')],
      },
      {
        id: 'comida-danada',
        question: '¿Cómo sé si la comida se dañó?',
        blocks: [paragraph('Descartala si perdió la cadena de frío, el empaque está inflado o dañado, presenta un olor claramente anormal, textura viscosa o cambios que no corresponden al producto habitual. Si dudás, no la ofrezcás y envianos foto, lote y fecha de compra.')],
      },
    ],
  },
  {
    id: 'pedidos-entregas',
    label: 'Pedidos y entregas',
    shortLabel: 'Pedidos',
    description: 'Compra asistida, zonas, costo, cambios y recepción.',
    icon: 'truck',
    items: [
      {
        id: 'hacer-pedido',
        question: '¿Cómo hago mi pedido?',
        blocks: [paragraph('Elegí productos en el catálogo, revisá la solicitud y continuá por WhatsApp. El sitio prepara un resumen, pero el pedido queda pendiente hasta que DNAture confirme disponibilidad, monto, pago y entrega.'), linkParagraph('Empezá en nuestro ', { text: 'catálogo', href: '/productos' }, '.')],
      },
      {
        id: 'saber-cuanto-necesita',
        question: '¿Cómo sé cuánto alimento necesita mi mascota?',
        blocks: [linkParagraph('Usá la ', { text: 'calculadora de porciones', href: '/calculadora' }, ' como estimación inicial. Para orientarte mejor, tené a mano especie, edad, peso, condición corporal, actividad y si está esterilizada.')],
      },
      {
        id: 'entregas-domicilio',
        question: '¿Realizan entregas a domicilio?',
        blocks: [paragraph('Sí. Coordinamos entregas refrigeradas en el GAM. La cobertura y disponibilidad se confirman por WhatsApp antes de cerrar el pedido.')],
      },
      {
        id: 'dias-entrega',
        question: '¿Qué días realizan las entregas?',
        blocks: [paragraph('Los días dependen de la ruta y capacidad disponible. Compartí tu ubicación por WhatsApp para confirmar la próxima fecha; no asumás una fecha hasta recibir respuesta del equipo.')],
      },
      {
        id: 'zonas-entrega',
        question: '¿A qué zonas realizan entregas?',
        blocks: [paragraph('La cobertura principal es el GAM y puede variar por ruta. Enviá tu ubicación o distrito por WhatsApp para que el equipo confirme si podemos llegar y bajo qué condiciones.')],
      },
      {
        id: 'costo-envio',
        question: '¿Cuál es el costo de envío?',
        blocks: [paragraph('El checkout utiliza una tarifa estimada de ₡3.500 para entrega. El monto y la cobertura finales se confirman por WhatsApp antes de procesar la solicitud.')],
      },
      {
        id: 'anticipacion-pedido',
        question: '¿Con cuánto tiempo debo hacer mi pedido?',
        blocks: [paragraph('Hacelo con la mayor anticipación posible, especialmente si necesitás una fecha concreta. El tiempo depende de existencias, preparación y ruta; nuestro equipo confirmará cuándo puede estar listo.')],
      },
      {
        id: 'pedidos-recurrentes',
        question: '¿Puedo programar pedidos recurrentes?',
        blocks: [paragraph('Por ahora no existe una suscripción automática en el sitio. Podés coordinar una frecuencia con atención al cliente y confirmar cada pedido según disponibilidad.')],
      },
      {
        id: 'cambios-pedido',
        question: '¿Puedo hacer cambios en mi pedido?',
        blocks: [paragraph('Escribinos cuanto antes con la referencia de la solicitud. Confirmaremos si todavía puede modificarse según su estado de preparación o despacho.')],
      },
      {
        id: 'no-estoy-en-casa',
        question: '¿Qué pasa si no estoy en casa cuando llega mi pedido?',
        blocks: [paragraph('Contactá al equipo apenas sepás que no podrás recibirlo. Al tratarse de producto refrigerado, no debe dejarse sin una persona responsable ni fuera de la cadena de frío. La reprogramación depende de la ruta disponible.')],
      },
    ],
  },
  {
    id: 'precios-planes',
    label: 'Precios y planes',
    shortLabel: 'Precios',
    description: 'Costo estimado, presentaciones, asesoría y cálculo de ración.',
    icon: 'wallet',
    items: [
      {
        id: 'costo-alimentacion',
        question: '¿Cuánto cuesta alimentar a mi mascota con DNAture?',
        blocks: [paragraph('Depende de la ración diaria, receta y presentación elegida. Los precios del catálogo se muestran antes de IVA; el checkout calcula 13 % de IVA y, cuando corresponde, una entrega estimada de ₡3.500.'), paragraph('El monto final se confirma por WhatsApp junto con disponibilidad y entrega.')],
      },
      {
        id: 'costo-vs-concentrado',
        question: '¿Por qué una dieta natural puede costar más que un concentrado?',
        blocks: [paragraph('Influyen los ingredientes, humedad, preparación, empaque, congelación y cadena de frío. Compará el costo por ración real y el propósito nutricional del producto, no solo el precio por kilogramo.')],
      },
      {
        id: 'presentaciones-pequenas',
        question: '¿Tienen presentaciones pequeñas?',
        blocks: [paragraph('Las presentaciones varían por producto. Revisá el selector de presentación en el catálogo o consultanos si necesitás una cantidad específica para probar.')],
      },
      {
        id: 'descuentos-cantidad',
        question: '¿Tienen descuentos por comprar mayor cantidad?',
        blocks: [paragraph('No publicamos un descuento fijo sin confirmar la campaña y sus condiciones. Preguntá por las opciones vigentes al preparar tu solicitud; cualquier precio especial debe quedar confirmado por el equipo.')],
      },
      {
        id: 'planes-personalizados',
        question: '¿Tienen planes personalizados?',
        blocks: [paragraph('Podemos orientarte sobre productos y una ración estimada según los datos de tu mascota. Esto no equivale a una dieta terapéutica ni sustituye una consulta veterinaria.'), linkParagraph('Conocé el ', { text: 'Plan DNAture', href: '/plan-dnature' }, '.')],
      },
      {
        id: 'costo-asesoria',
        question: '¿La asesoría nutricional tiene costo?',
        blocks: [paragraph('El alcance y costo dependen del tipo de orientación requerida. Consultá al equipo antes de agendar para confirmar qué incluye, quién la brinda y si tiene un costo asociado.')],
      },
      {
        id: 'calculo-racion',
        question: '¿Cómo calculan la ración recomendada?',
        blocks: [paragraph('Partimos de peso, especie, etapa de vida, esterilización, actividad y condición corporal. El resultado es una estimación inicial que debe ajustarse según el producto y la evolución de la mascota.'), linkParagraph('Calculá una referencia en la ', { text: 'calculadora', href: '/calculadora' }, '.')],
      },
    ],
  },
  {
    id: 'gatos',
    label: 'Para gatos',
    shortLabel: 'Gatos',
    description: 'Productos apropiados, diferencias nutricionales y transición felina.',
    icon: 'cat',
    items: [
      {
        id: 'gatos-pueden-comer',
        question: '¿Los gatos también pueden comer las dietas DNAture?',
        blocks: [paragraph('Únicamente los productos cuya ficha indique que son adecuados para gatos y para su etapa de vida. No usés automáticamente una receta formulada para perros.')],
      },
      {
        id: 'diferencia-perros-gatos',
        question: '¿Qué diferencia hay entre la alimentación natural de perros y gatos?',
        blocks: [paragraph('Perros y gatos tienen requerimientos distintos. Los gatos, por ejemplo, necesitan nutrientes como taurina y vitamina A preformada en cantidades y relaciones propias de su especie. Por eso una receta debe declarar para cuál especie y etapa fue formulada.'), linkParagraph('AAFCO resume estas diferencias en su guía para ', { text: 'seleccionar alimento', href: 'https://www.aafco.org/consumers/understanding-pet-food/selecting-the-right-pet-food/' }, '.')],
      },
      {
        id: 'suplementos-para-gatos',
        question: '¿Los gatos necesitan suplementos diferentes?',
        blocks: [paragraph('Sus necesidades nutricionales sí son diferentes, pero una dieta completa para gatos no debería requerir suplementos adicionales para “completarla”. Cualquier suplemento extra debe considerar la dieta total y la indicación veterinaria.')],
      },
      {
        id: 'transicion-gato-concentrado',
        question: '¿Un gato que solo ha comido concentrado puede hacer la transición?',
        blocks: [paragraph('Sí, pero muchos gatos necesitan un cambio más lento de sabor y textura. Ofrecé pequeñas cantidades junto a su alimentación habitual y avanzá solo si mantiene un consumo adecuado.'), note('No sometás a un gato a ayuno para forzar el cambio. Si deja de comer o reduce mucho su consumo, contactá pronto a su médico veterinario.')],
      },
      {
        id: 'gato-no-quiere-comer',
        question: '¿Qué hago si mi gato no quiere comer la dieta natural?',
        blocks: [paragraph('Probá una transición más gradual, porciones pequeñas, un plato limpio y un ambiente tranquilo. No lo forcés ni retirés toda alternativa de forma abrupta.'), paragraph('Si rechaza también otros alimentos, pierde peso, vomita o cambia su comportamiento, consultá al veterinario; la falta de apetito en gatos no debe prolongarse.')],
      },
    ],
  },
];

const FAQ = faqCategories.flatMap((category) => category.items);

export { faqCategories };
export default FAQ;
