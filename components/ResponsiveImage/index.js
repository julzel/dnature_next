import React from 'react';
import Image from 'next/image'

import styles from './ResponsiveImage.module.scss'

const ResponsiveImage = ({ src, altText }) => {
    return (
        <div className={styles.responsiveImage}>
            <Image src={src} alt={altText} />
        </div>
    );
}
 
export default ResponsiveImage;