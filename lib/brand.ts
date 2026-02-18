import Cookies from 'js-cookie';

export type Brand = 'ringomode' | 'cintasign';

const BRAND_COOKIE = 'brand';

export function setBrand(brand: Brand): void {
  Cookies.set(BRAND_COOKIE, brand, { 
    expires: 7, 
    path: '/', 
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' // only secure in production
  });
  console.log('Brand cookie set:', brand);
}

export function getBrand(): Brand {
  return (Cookies.get(BRAND_COOKIE) as Brand) || 'ringomode';
}