import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';

const GoBack = ({ className }) => (
  <div className={className}>
    <Link href={'/productos'} passHref>
      <span>
        <FontAwesomeIcon icon={faCircleLeft} size='1x' />
        &nbsp; Volver
      </span>
    </Link>
  </div>
);

export default GoBack;
