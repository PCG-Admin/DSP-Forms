'use client';

import Image from 'next/image';
import { getBrand } from '@/lib/brand';
import { useEffect, useState } from 'react';

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function BrandLogo({ className, width = 160, height = 50 }: BrandLogoProps) {
  const [brand, setBrand] = useState<'ringomode' | 'cintasign'>('ringomode');

  useEffect(() => {
    // Read the cookie when the component mounts
    setBrand(getBrand());

    // Optional: listen for storage events if you allow switching without reload
    const handleStorage = () => setBrand(getBrand());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logoSrc = brand === 'ringomode' ? '/images/ringomode-logo.png' : '/images/cintasign-logo.jpg';
  const alt = brand === 'ringomode' ? 'Ringomode DSP' : 'Cintasign';

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}