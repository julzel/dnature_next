import Image from "next/image";
import styles from "./pet-species-image.module.css";

type PetSpeciesImageProps = {
  species: "cat" | "dog";
  /** Use an empty alt when adjacent text already names the species. */
  alt: string;
  size?: number;
  variant?: "engraving" | "silhouette";
  animated?: boolean;
  revealed?: boolean;
};

export function PetSpeciesImage({
  species,
  alt,
  size = 128,
  variant = size < 96 ? "silhouette" : "engraving",
  animated = false,
  revealed = true,
}: PetSpeciesImageProps) {
  const suffix = variant === "silhouette" ? "-small" : "";

  return (
    <Image
      src={`/images/pets/${species}${suffix}.svg`}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={styles.image}
      data-species={species}
      data-animated={animated}
      data-revealed={revealed}
    />
  );
}
