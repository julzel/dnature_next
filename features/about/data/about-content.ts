// Editorial adaptations of DNAture_Brand_Reference.json / brand_strategy.
// Original Spanish: DNA-BRANDBOOK.pdf pp. 4–6, 10–13, 17. See ../README.md.
export const aboutDescription =
  "Conocé DNAture: nuestro propósito, misión y visión de nutrición fisiológica en Costa Rica. Ciencia, conciencia y comunidad al servicio de perros y gatos.";

export const directions = [
  {
    id: "mision",
    label: "Misión",
    horizon: "Lo que nos mueve hoy",
    heading: "El bienestar empieza por entender a cada animal.",
    description:
      "Nuestra misión es contribuir al bienestar de perros y gatos a través de una nutrición fisiológica que respete las necesidades de cada individuo.",
    detail:
      "Buscamos unir conocimiento científico, educación y acompañamiento responsable para que cada tutor pueda tomar decisiones informadas sobre su alimentación.",
    principles: ["Biología individual", "Conocimiento científico", "Cuidado responsable"],
  },
  {
    id: "vision",
    label: "Visión",
    horizon: "El futuro que queremos construir",
    heading: "Tutores conscientes y bien informados.",
    description:
      "Queremos ser un referente de nutrición fisiológica animal en Costa Rica y transformar la forma en que entendemos la alimentación de perros y gatos.",
    detail:
      "Imaginamos una comunidad de tutores informados y profesionales de salud animal conectados. Aspiramos a acercar la educación y el cuidado mediante herramientas tecnológicas y nuevas formas de acompañar.",
    principles: ["Educación accesible", "Colaboración profesional", "Tecnología que acerca"],
  },
] as const;

export const essence = [
  {
    id: "ciencia",
    name: "Ciencia",
    dimension: "La razón que guía",
    associations: ["Conocimiento", "Confianza", "Seguridad"],
    description:
      "Entender antes de recomendar. Nos mueve el conocimiento científico y la voluntad de explicar la nutrición con claridad, sin tecnicismos innecesarios.",
    practice:
      "La confianza se construye distinguiendo lo que sabemos, lo que necesita contexto y lo que todavía debemos investigar.",
    href: "/ciencia/nuestros-criterios",
    link: "Conocé nuestros criterios de información",
  },
  {
    id: "conciencia",
    name: "Conciencia",
    dimension: "La empatía que cuida",
    associations: ["Empatía", "Propósito", "Respeto"],
    description:
      "Cada perro y cada gato tiene una biología propia. Detrás hay una persona que quiere cuidarlo bien, con sus preguntas, sus rutinas y su historia.",
    practice:
      "Escuchar sin juzgar, comunicar con honestidad y respetar esa individualidad son parte de nuestra manera de entender el cuidado.",
    href: "#proposito",
    link: "Conocé el propósito que nos mueve",
  },
  {
    id: "tribu",
    name: "Tribu",
    dimension: "La comunidad que acompaña",
    associations: ["Comunidad", "Acompañamiento", "Coherencia"],
    description:
      "Cuidar también es compartir lo que aprendemos. Creemos en el diálogo entre tutores y profesionales de salud animal, y en una comunidad que crece con conocimiento.",
    practice:
      "Queremos que cada conversación transforme una duda en una oportunidad para aprender y elegir con más confianza.",
    href: "/#contacto",
    link: "Conversemos sobre tus preguntas",
  },
] as const;
