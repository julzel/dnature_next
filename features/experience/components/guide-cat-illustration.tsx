import styles from "./pet-choice-illustration.module.css";

export function GuideCatIllustration() {
  return (
    <svg className={styles.illustration} xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240" fill="none" aria-hidden="true" focusable="false" data-illustration="guide-cat">
      <ellipse cx="160" cy="126" rx="116" ry="87" fill="var(--pet-cloud)" />
      <circle cx="252" cy="61" r="17" fill="var(--pet-mint)" fillOpacity=".45" />
      <path d="M61 194h101m13 0c22 0 31-16 52-16s35 3 52-12" stroke="var(--pet-teal)" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />

      <g stroke="var(--pet-ink)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M223 112v76m-9 1h18" />
        <path d="M196 80h66l20 18-20 18h-66Z" fill="var(--pet-mint)" />
        <path className={styles.signArrow} d="M213 98h43m-8-8 9 8-9 8" stroke="var(--pet-teal)" strokeWidth="3" />

        <path className={styles.catTail} d="M113 176c-24 7-38-1-36-18 1-9-1-14-7-12-12 4-14 25-4 37 11 13 31 14 49 5" fill="var(--pet-mint)" />
        <path d="M119 119c-8 15-17 38-18 57-1 14 12 18 31 18 18 0 32-5 30-17-3-21-10-42-19-57Z" fill="var(--pet-paper)" />
        <path d="M128 133c-6 9-10 23-9 32 6 5 16 5 23 0-1-12-5-24-9-32Z" fill="var(--pet-mint)" stroke="none" />
        <path d="M120 148v32h-5c-6 0-7 10 0 10h16m9-33 1 24h6c7 0 8 9 1 9h-17v-24" fill="var(--pet-paper)" />

        <path d="m99 89-3-35c10 2 20 9 27 18 8-3 16-3 24 0l17-18-1 37c8 19-5 36-29 37-24 0-39-16-35-39Z" fill="var(--pet-paper)" />
        <path d="m103 67 3 20 11-10Zm53 0-12 12 12 7Z" fill="var(--pet-mint)" stroke="none" />
        <path d="M112 96c3-4 7-4 10 0m21 0c3-4 7-4 10 0" />
        <path d="m129 104 5 4 5-4Z" fill="var(--pet-teal)" stroke="var(--pet-teal)" strokeWidth="1.8" />
        <path d="M134 108v4m0 0c-3 4-6 4-9 1m9-1c3 4 6 4 9 1m-29-7-17-3m18 10-18 2m56-9 17-3m-18 10 18 2" strokeWidth="1.8" />
        <path d="M119 128c9 5 18 5 27 0" stroke="var(--pet-teal)" strokeWidth="4" />
        <circle cx="133" cy="133" r="4" fill="var(--pet-mint)" strokeWidth="1.8" />

        <g className={styles.catPaw} data-motion="guide">
          <path d="M148 139c9-1 18-8 27-10 10-4 16 0 15 6-1 5-7 8-15 9l-17 9c-6 2-10-3-10-8" fill="var(--pet-paper)" />
          <path d="m181 130 1 5m-7-4 1 5" strokeWidth="1.8" />
        </g>
      </g>
      <path d="M64 93v10m-5-5h10M274 140v6m-3-3h6" stroke="var(--pet-teal)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
