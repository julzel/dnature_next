import React from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';

const GoBack = ({ className }) => {
  const router = useRouter();

  const goBack = (event) => {
    event.preventDefault();
    router.back();
  }

  return (
    <div className={className} onClick={goBack}>
      <span>
        <FontAwesomeIcon icon={faCircleLeft} size='1x' />
        &nbsp; Volver
      </span>
    </div>
  );
};

export default GoBack;
