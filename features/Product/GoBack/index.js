'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const GoBack = ({ className }) => {
  const router = useRouter();

  const goBack = (event) => {
    event.preventDefault();
    router.back();
  };

  return (
    <div className={className} onClick={goBack}>
      <ChevronLeft size={24} />
      <span>Volver</span>
    </div>
  );
};

export default GoBack;
