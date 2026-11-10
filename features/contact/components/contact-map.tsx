import { ArrowUpRight, MapPin } from "lucide-react";
import contact from "../data/contact.json";
import styles from "./contact-map.module.css";

export function ContactMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const coordinates = `${contact.map.latitude},${contact.map.longitude}`;
  const embedParameters = new URLSearchParams({
    key: apiKey ?? "",
    q: coordinates,
    center: coordinates,
    zoom: "16",
    language: "es",
    region: "CR",
  });

  return (
    <div className={styles.location}>
      <div className={styles.heading}>
        <MapPin size={24} strokeWidth={1.5} aria-hidden="true" />
        <h3>Nuestra ubicación</h3>
      </div>
      {apiKey ? (
        <iframe
          className={styles.map}
          title="Ubicación de DNAture en Google Maps"
          src={`https://www.google.com/maps/embed/v1/place?${embedParameters}`}
          width="640"
          height="420"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div className={styles.mapFallback}>
          <MapPin size={48} strokeWidth={1} aria-hidden="true" />
          <p>Consultá nuestra ubicación en Google Maps.</p>
        </div>
      )}
      <a className={styles.mapLink} href={contact.map.url} target="_blank" rel="noopener noreferrer">
        <span>Ver ubicación en Google Maps</span>
        <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" />
        <span className="sr-only"> (abre en otra pestaña)</span>
      </a>
    </div>
  );
}
