'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';
import useCompatibleNavigation from '../../../hooks/useCompatibleNavigation';

const GoBack = ({ className }) => {
  const { back } = useCompatibleNavigation();

  return (
    <button className={className} onClick={back} type="button">
        <FontAwesomeIcon icon={faCircleLeft} size='1x' />
        &nbsp; Volver
    </button>
  );
};

export default GoBack;
