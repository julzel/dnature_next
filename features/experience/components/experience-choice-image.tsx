import Image from "next/image";

type ExperienceChoiceImageProps = {
  experience: "guided" | "explore";
  alt?: string;
};

export function ExperienceChoiceImage({ experience, alt = "" }: ExperienceChoiceImageProps) {
  const filename = experience === "guided" ? "visita-guiada" : "explorar-por-mi-cuenta";

  return (
    <Image
      src={`/images/experiences/${filename}.svg`}
      alt={alt}
      width={640}
      height={480}
      unoptimized
      data-illustration={experience}
    />
  );
}
