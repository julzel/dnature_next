import styles from "./pet-choice-illustration.module.css";

export function ExplorerDogIllustration() {
  return (
    <svg className={styles.illustration} xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240" fill="none" aria-hidden="true" focusable="false" data-illustration="explorer-dog">
      <ellipse cx="157" cy="126" rx="116" ry="87" fill="var(--pet-cloud)" />
      <circle cx="65" cy="77" r="17" fill="var(--pet-mint)" fillOpacity=".45" />
      <path d="M55 192c39 13 65-2 96 0s63 20 91-2 23-40 46-39" stroke="var(--pet-teal)" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />

      <g fill="var(--pet-teal)" className={styles.trail}>
        <g transform="translate(246 188) rotate(24)">
          <path d="M-6 1c-6 8-3 12 2 10 3-1 5-1 8 0 5 2 8-2 2-10C3-3-3-3-6 1Z" />
          <ellipse cx="-9" cy="-2" rx="2.5" ry="3.5" transform="rotate(-25 -9 -2)" />
          <ellipse cx="-3" cy="-7" rx="2.5" ry="3.5" />
          <ellipse cx="4" cy="-7" rx="2.5" ry="3.5" />
          <ellipse cx="10" cy="-2" rx="2.5" ry="3.5" transform="rotate(25 10 -2)" />
        </g>
        <g transform="translate(277 159) rotate(45) scale(.75)">
          <path d="M-6 1c-6 8-3 12 2 10 3-1 5-1 8 0 5 2 8-2 2-10C3-3-3-3-6 1Z" />
          <ellipse cx="-9" cy="-2" rx="2.5" ry="3.5" />
          <ellipse cx="-3" cy="-7" rx="2.5" ry="3.5" />
          <ellipse cx="4" cy="-7" rx="2.5" ry="3.5" />
          <ellipse cx="10" cy="-2" rx="2.5" ry="3.5" />
        </g>
      </g>

      <g className={styles.dog} stroke="var(--pet-ink)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" data-motion="explore">
        <path className={styles.dogTail} d="M94 119C72 116 63 96 69 78c3-8 11-6 10 2-2 14 6 23 22 25" fill="var(--pet-mint)" />
        <path className={styles.dogBackLeg} d="m110 142 5 30 12 8c4 3 1 7-3 7h-15l-14-38" fill="var(--pet-mint)" />
        <path className={styles.dogFarLeg} d="m162 140 15 32 12 5c5 2 3 8-2 8h-13l-25-35" fill="var(--pet-mint)" />
        <path d="M87 115c4-16 22-22 40-18l35 8c14 3 22 16 23 29 1 14-11 23-29 22l-48-4c-19-2-27-19-21-37Z" fill="var(--pet-paper)" />
        <path d="M103 101c5 15 18 19 28 13 6-4 7-9 7-14l-11-3c-9-2-17-1-24 4Z" fill="var(--pet-mint)" stroke="none" />
        <path className={styles.dogNearLeg} d="M104 132c-6 5-9 12-8 20l-7 26h11c6 0 7 8 1 9H81c-5 0-7-4-5-9l9-35" fill="var(--pet-paper)" />
        <path className={styles.dogFrontLeg} d="M164 136c6 8 9 18 9 28l-1 15h10c6 0 7 8 0 9h-19c-4 0-6-3-5-7l-2-28" fill="var(--pet-paper)" />
        <g className={styles.dogHead}>
          <path d="M170 119c3-17 20-23 34-13 10 7 13 18 22 27l14 9c8 5 7 15-2 20-12 7-24 0-31-7l-16-10-15-6" fill="var(--pet-paper)" />
          <path d="m177 130 20 16-6 7-20-17Z" fill="var(--pet-teal)" stroke="var(--pet-teal)" strokeWidth="1.5" />
          <circle cx="190" cy="151" r="4" fill="var(--pet-mint)" strokeWidth="1.8" />
          <path className={styles.dogEar} d="M193 108c-11-7-24-2-23 10 0 10 7 21 14 24 7-5 12-23 9-34Z" fill="var(--pet-mint)" />
          <circle cx="211" cy="132" r="3" fill="var(--pet-ink)" stroke="none" />
          <path d="m207 123 5 2m16 29c3 3 7 3 10 1" strokeWidth="2" />
          <ellipse className={styles.dogNose} cx="240" cy="145" rx="6" ry="4.5" fill="var(--pet-ink)" stroke="none" />
        </g>
      </g>
      <g className={styles.sniff} stroke="var(--pet-teal)" strokeWidth="2" strokeLinecap="round">
        <path d="m253 138 5-3m-3 12h6m-8 9 5 3" />
      </g>
      <path d="M268 79v10m-5-5h10M52 151v6m-3-3h6" stroke="var(--pet-teal)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
