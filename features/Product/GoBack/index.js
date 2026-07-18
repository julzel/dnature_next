'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';
import useCompatibleNavigation from '../../../hooks/useCompatibleNavigation';

const GoBack = ({ className }) => {
  const { back } = useCompatibleNavigation();

  const goBack = (event) => {
    event.preventDefault();
    back();
  };

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
