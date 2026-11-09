import recipesImage from "@/images/products-diet.jpg";
import driedImage from "@/images/products-snacks.jpg";
import organsImage from "@/images/products-proteins.jpg";
import complementsImage from "@/images/plandna-mobile.jpg";
import supplementsImage from "@/images/products-super.jpg";

// Portfolio exploration only. These are not purchasable or species-eligible SKU records.
export const families = [
  { id: "complementos", name: "Complementos", group: "Complementos", color: "var(--dn-category-complementos)", image: complementsImage, imageAlt: "Selección de ingredientes del portafolio DNAture", description: "Conocé la composición y la función indicada de cada complemento antes de elegir." },
  { id: "deshidratados", name: "Deshidratados", group: "Deshidratados", color: "var(--dn-category-deshidratados)", image: driedImage, imageAlt: "Productos deshidratados de referencia", description: "Explorá las presentaciones y consultá ingredientes, conservación e indicaciones de uso." },
  { id: "organos", name: "Órganos", group: "Órganos", color: "var(--dn-category-organos)", image: organsImage, imageAlt: "Ingredientes de referencia de la categoría Órganos", description: "Revisá el órgano específico, la composición y las indicaciones de cada producto." },
  { id: "recetas-completas", name: "Recetas completas", group: "Recetas completas", color: "var(--dn-category-recetas-completas)", image: recipesImage, imageAlt: "Presentaciones de referencia de las recetas DNAture", description: "Conocé los ingredientes, la composición y el uso indicado de cada fórmula." },
  { id: "suplementos", name: "Suplementos", group: "Suplementos", color: "var(--dn-category-suplementos)", image: supplementsImage, imageAlt: "Frascos e ingredientes de suplementos del portafolio DNAture", description: "Composición clara y uso informado. La orientación profesional es parte de una elección responsable." },
] as const;

export type Family = (typeof families)[number];

export const questions = [
  { question: "¿Por dónde empiezo si todavía no conozco DNAture?", answer: "Podés empezar explorando las familias de productos o conociendo nuestro enfoque. No necesitás crear un perfil ni completar un cuestionario para navegar." },
  { question: "¿Todas las recetas completas tienen el mismo uso?", answer: "Cada fórmula tiene ingredientes e indicaciones propias. Revisá la clasificación nutricional, la especie y el uso indicado en la información actual del producto." },
  { question: "¿Elegir perro o gato me da una recomendación nutricional?", answer: "No. Es una forma de empezar a explorar información. No realiza un diagnóstico, una evaluación genética ni una recomendación individual de dieta." },
  { question: "¿Dónde puedo conocer el respaldo de la información?", answer: "En Ciencia podés conocer nuestro enfoque y los criterios que debe cumplir la información antes de publicarse: fuentes identificables, revisión profesional y límites claros." },
] as const;
