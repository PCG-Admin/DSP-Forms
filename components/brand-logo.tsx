'use client';

import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  brand: 'ringomode' | 'cintasign'; // 👈 brand is now required
}

export function BrandLogo({ className, width = 160, height = 50, brand }: BrandLogoProps) {
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