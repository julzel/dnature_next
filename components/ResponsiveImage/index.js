import React, { useState } from "react";
import Image from "next/image";
import LazyLoad from "react-lazy-load-image-component";

// local imports
// styles
import styles from "./ResponsiveImage.module.scss";

// components
import ImagePlaceholder from "../ImagePlaceholder";

function ResponsiveImage({ src, alt, lazy, threshold, flipY }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`${styles.responsiveImage} ${flipY ? styles.flipY : ""}`}>
      {lazy ? (
        <LazyLoad
          threshold={threshold || 300}
          src={src}
          alt={alt}
          onContentVisible={() => setLoaded(true)}
        >
          {loaded ? (
            <Image src={src} alt={alt} layout="responsive" />
          ) : (
            <ImagePlaceholder />
          )}
        </LazyLoad>
      ) : (
        <Image
          src={src}
          alt={alt}
          layout="responsive"
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

export default ResponsiveImage;
