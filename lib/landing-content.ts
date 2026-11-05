import recipesImage from "@/images/products-diet.jpg";
import troutImage from "@/images/products-snacks.jpg";
import cookedImage from "@/images/dnatureproducts.jpg";
import wildImage from "@/images/products-proteins.jpg";
import complementsImage from "@/images/plandna-mobile.jpg";
import chewsImage from "@/images/category-snack.jpg";
import treatsImage from "@/images/category-proteins.jpg";
import supplementsImage from "@/images/products-super.jpg";

// Portfolio exploration only. These are not purchasable or species-eligible SKU records.
export const families = [
  { id: "complete", name: "Recetas Complete", group: "Recetas", color: "#84A341", image: recipesImage, imageAlt: "Presentaciones de referencia de las recetas DNAture", description: "Ingredientes, composición y función nutricional: conocé la información que importa en cada fórmula." },
  { id: "trucha", name: "Recetas de Trucha", group: "Recetas", color: "#742019", image: troutImage, imageAlt: "Truchas del portafolio DNAture", description: "Una familia con indicaciones propias. Su función no debe confundirse con la de las Recetas Complete." },
  { id: "cocidas", name: "Recetas Cocidas", group: "Recetas", color: "#4E8997", image: cookedImage, imageAlt: "Selección de presentaciones del portafolio DNAture", description: "Otra forma de preparación. Revisá el uso, la conservación y la clasificación de cada receta." },
  { id: "wild", name: "Recetas Wild", group: "Recetas", color: "#124563", image: wildImage, imageAlt: "Ingredientes de referencia de una receta DNAture", description: "Explorá la familia Wild y consultá los ingredientes y las indicaciones de cada presentación." },
  { id: "complementos", name: "Complementos Nutricionales", group: "Complementos", color: "#D8A73C", image: complementsImage, imageAlt: "Selección de ingredientes del portafolio DNAture", description: "Una función distinta dentro de la alimentación. Conocé su composición y sus límites de uso." },
  { id: "masticacion", name: "Complementos de Masticación", group: "Complementos", color: "#8E3485", image: chewsImage, imageAlt: "Fotografía de referencia de ingredientes del portafolio", description: "Formato, ingredientes y supervisión: información que ayuda a elegir con criterio." },
  { id: "masticables", name: "Masticables", group: "Masticables y Treats", color: "#426D36", image: chewsImage, imageAlt: "Ingredientes de referencia del portafolio DNAture", description: "Explorá las presentaciones y consultá las indicaciones de uso y supervisión de cada producto." },
  { id: "treats", name: "Treats", group: "Masticables y Treats", color: "#CA6C2A", image: treatsImage, imageAlt: "Fotografía de referencia de ingredientes DNAture", description: "Para conocer otras formas de compartir. Revisá la información de cada presentación antes de elegir." },
  { id: "suplementos", name: "Suplementos", group: "Suplementos", color: "#531845", image: supplementsImage, imageAlt: "Frascos e ingredientes de suplementos del portafolio DNAture", description: "Composición clara y uso informado. La orientación profesional es parte de una elección responsable." },
] as const;

export type Family = (typeof families)[number];

export const questions = [
  { question: "¿Por dónde empiezo si todavía no conozco DNAture?", answer: "Podés empezar explorando las familias de productos o conociendo nuestro enfoque. No necesitás crear un perfil ni completar un cuestionario para navegar." },
  { question: "¿Todas las recetas cumplen la misma función?", answer: "No. Las Recetas Complete, de Trucha, Cocidas y Wild son familias distintas. La clasificación nutricional, la especie y las indicaciones deben verificarse en la información de cada fórmula." },
  { question: "¿Elegir perro o gato me da una recomendación nutricional?", answer: "No. Es una forma de empezar a explorar información. No realiza un diagnóstico, una evaluación genética ni una recomendación individual de dieta." },
  { question: "¿Dónde puedo conocer el respaldo de la información?", answer: "En Ciencia podés conocer nuestro enfoque y los criterios que debe cumplir la información antes de publicarse: fuentes identificables, revisión profesional y límites claros." },
] as const;
