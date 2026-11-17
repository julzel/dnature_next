import type { CSSProperties, ReactNode } from "react";
import styles from "./page-hero.module.css";

type PageHeroProps = {
  title: string;
  accent?: string;
  titleId: string;
  description: ReactNode;
  navigation?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
  fixedHeader?: boolean;
  catalogRail?: boolean;
  railColor?: CSSProperties["color"];
};

export function PageHero({ title, accent, titleId, description, navigation, actions, media, fixedHeader = true, catalogRail = false, railColor }: PageHeroProps) {
  const style = railColor ? { "--page-hero-rail": railColor } as CSSProperties : undefined;

  return (
    <section className={styles.hero} aria-labelledby={titleId} data-page-hero data-fixed-header={fixedHeader} data-has-media={Boolean(media)} style={style}>
      <div className={styles.inner}>
        <div className={styles.navigation}>{navigation}</div>
        <div className={styles.body} data-has-media={Boolean(media)}>
          <div className={styles.content}>
            <h1 id={titleId} className={styles.title}>{title}{accent && <> <span>{accent}</span></>}</h1>
            <p className={styles.description}>{description}</p>
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
        </div>
      </div>
      {media && <div className={styles.media} aria-hidden="true">{media}</div>}
      <div className={styles.rail} data-catalog={catalogRail} aria-hidden="true">
        {catalogRail && <><span /><span /><span /><span /><span /></>}
      </div>
    </section>
  );
}
