import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';

const GoBack = ({ className }) => {
  return (
    <Link className={className} href="/productos">
      <FontAwesomeIcon icon={faCircleLeft} size="1x" />
      &nbsp; Volver
    </Link>
  );
};

export default GoBack;
